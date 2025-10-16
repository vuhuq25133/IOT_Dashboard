import Sensor from "../models/sensors.model.js";

const changeTimezone = (datStr) => {
  const dateRegex = /^\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}:\d{2}$/;
  if (!dateRegex.test(datStr)) return null;

  const [date, time] = datStr.split(" ");
  const [year, month, day] = date.split("/").map(Number);
  const [hour, minute, second] = time.split(":").map(Number);
  return new Date(Date.UTC(year, month - 1, day, hour - 7, minute, second));
};

const escapeRegex = (s = "") => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const buildDateTimePatterns = (raw = "") => {
  const kw = raw.trim();
  if (!kw) return [];
  const patterns = [];

  // time-only
  if (kw.includes(":") && !kw.includes("/")) {
    const parts = kw.split(":").map((p) => escapeRegex(p));
    const hh = parts[0] ? `0?${parts[0]}` : "\\d{2}";
    const mm = parts[1] || "\\d{2}";
    const ss = parts[2] || "\\d{2}";
    const tail = parts.length >= 3 ? `:${ss}` : `(?::${ss})?`;
    patterns.push(`${hh}:${mm}${tail}`);
    return patterns;
  }


  if (kw.includes("/") && !kw.includes(":")) {
    const segs = kw.split("/").map((s) => s.trim());
    if (segs.length === 3) {
      const [s1, s2, s3] = segs;
      const isYearFirst = s1.length === 4 || Number(s1) > 31;
      const pad2 = (v) => (v.length === 1 ? `0${escapeRegex(v)}` : escapeRegex(v));
      const normYear = (y) => (y.length === 2 ? `20${escapeRegex(y)}` : escapeRegex(y));
      const year = isYearFirst ? normYear(s1) : normYear(s3);
      const month = pad2(s2);
      const day = isYearFirst ? pad2(s3) : pad2(s1);
      // Only push canonical Y/M/D since $dateToString below uses this format
      patterns.push(`${year}/${month}/${day}`);
      return patterns;
    }
    patterns.push(escapeRegex(kw));
    return patterns;
  }

  // fallback
  patterns.push(escapeRegex(kw));
  return patterns;
};

export const getAllSenSors = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const keyword = req.query.keyword?.trim() || "";
    const searchBy = req.query.searchBy || "all";
    const sortBy = req.query.sortBy || "timestamp";
    const typeSort = req.query.typeSort === "asc" ? 1 : -1;

    const query = {};

    if (keyword && (searchBy === "date" || searchBy === "all")) {
      // Cho phép tìm theo substring theo chuẩn hiển thị "yyyy/mm/dd hh:mm:ss"
      const patterns = buildDateTimePatterns(keyword);

      const orConds = [];
      for (const p of patterns) {
        for (const field of ["timestamp"]) {
          // so khớp theo chuẩn Y/M/D
          orConds.push({
            $expr: {
              $regexMatch: {
                input: {
                  $dateToString: {
                    format: "%Y/%m/%d %H:%M:%S",
                    date: `$${field}`,
                    timezone: "+07:00",
                  },
                },
                regex: p,
                options: "i",
              },
            },
          });
        }
      }

      const matchStage = {
        $match: {
          $or: orConds,
        },
      };

      const pipeline = [
        matchStage,
        { $sort: { [sortBy]: typeSort } },
        { $skip: skip },
        { $limit: limit },
      ];

      const countPipeline = [matchStage, { $count: "count" }];

      const [sensors, countResult] = await Promise.all([
        Sensor.aggregate(pipeline),
        Sensor.aggregate(countPipeline),
      ]);

      const total = countResult?.[0]?.count || 0;

      return res.status(200).json({
        currentPage: page,
        totalPages: Math.ceil(total / limit) || 1,
        totalResults: total,
        results: sensors,
      });
    } else {
      if (keyword && ["temperature", "humidity", "light"].includes(searchBy)) {
        const numVal = parseFloat(keyword);
        if (!isNaN(numVal)) query[searchBy] = numVal;
        else query[searchBy] = null;
      } else if (
        keyword &&
        !("all" === searchBy || "date" === searchBy || ["temperature", "humidity", "light"].includes(searchBy))
      ) {
        return res.status(400).json({
          error:
            "Tham so khong hop le. searchBy phai la all, temperature, humidity, light, date",
        });
      }

      const sensors = await Sensor.find(query)
        .sort({ [sortBy]: typeSort })
        .skip(skip)
        .limit(limit);

      const total = await Sensor.countDocuments(query);

      return res.status(200).json({
        currentPage: page,
        totalPages: Math.ceil(total / limit) || 1,
        totalResults: total,
        results: sensors,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
