import Action from "../models/actions.model.js";

// Utilities to support flexible date/time keyword matching
const escapeRegex = (s = "") => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const buildDateTimePatterns = (raw = "") => {
  const kw = raw.trim();
  if (!kw) return [];
  const patterns = [];

  // time-only: h:mm, hh:mm, h:mm:ss, hh:mm:ss
  if (kw.includes(":") && !kw.includes("/")) {
    const parts = kw.split(":").map((p) => escapeRegex(p));
    const hh = parts[0] ? `0?${parts[0]}` : "\\d{2}";
    const mm = parts[1] || "\\d{2}";
    const ss = parts[2] || "\\d{2}";
    const tail = parts.length >= 3 ? `:${ss}` : `(?::${ss})?`;
    patterns.push(`${hh}:${mm}${tail}`);
    return patterns;
  }

  // date-only: allow both D/M/Y and Y/M/D input
  if (kw.includes("/") && !kw.includes(":")) {
    const segs = kw.split("/");
    if (segs.length === 3) {
      const [a, b, c] = segs;
      const pad2 = (v) => (v.length === 1 ? `0${escapeRegex(v)}` : escapeRegex(v));
      const normYear = (y) => (y.length === 2 ? `20${escapeRegex(y)}` : escapeRegex(y));
      const day = pad2(a);
      const month = pad2(b);
      const year = normYear(c);
      patterns.push(`${year}/${month}/${day}`); // Y/M/D
      patterns.push(`${day}/${month}/${year}`); // D/M/Y
      return patterns;
    }
    patterns.push(escapeRegex(kw));
    return patterns;
  }

  // fallback substring
  patterns.push(escapeRegex(kw));
  return patterns;
};

export const getActionHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const keyword = req.query.keyword?.trim() || "";
    const searchBy = req.query.searchBy || "all"; // all | device | state | date
    const sortBy = req.query.sortBy || "timestamp"; // timestamp | device | newState
    const typeSort = req.query.typeSort === "asc" ? 1 : -1;
    const deviceFilter = (req.query.device || "all").toString(); // all | lamp | fan | air
    const stateFilter = (req.query.state || "all").toString(); // all | on | off

    // Date/time search via aggregation (substring on formatted string)
    if (keyword && (searchBy === "date" || searchBy === "all")) {
      const patterns = buildDateTimePatterns(keyword);
      const orConds = [];
      const andConds = [];
      if (deviceFilter !== "all") andConds.push({ device: deviceFilter });
      if (stateFilter !== "all") andConds.push({ newState: stateFilter });
      for (const p of patterns) {
        for (const field of ["timestamp"]) {
          // yyyy/mm/dd hh:mm:ss
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
          // dd/mm/yyyy hh:mm:ss (để người dùng quen dd/mm/yyyy vẫn tìm được)
          orConds.push({
            $expr: {
              $regexMatch: {
                input: {
                  $dateToString: {
                    format: "%d/%m/%Y %H:%M:%S",
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
        $match: andConds.length
          ? { $and: [...andConds, { $or: orConds }] }
          : { $or: orConds },
      };

      const pipeline = [
        matchStage,
        { $sort: { [sortBy]: typeSort } },
        { $skip: skip },
        { $limit: limit },
      ];

      const countPipeline = [matchStage, { $count: "count" }];

      const [actions, countResult] = await Promise.all([
        Action.aggregate(pipeline),
        Action.aggregate(countPipeline),
      ]);

      const totalActions = countResult?.[0]?.count || 0;
      return res.status(200).json({
        totalActions,
        totalPages: Math.ceil(totalActions / limit) || 1,
        currentPage: page,
        actions,
      });
    }

    // Device or state search (case-insensitive substring)
    const query = {};
    // independent dropdown filters
    if (deviceFilter !== "all") query.device = deviceFilter;
    if (stateFilter !== "all") query.newState = stateFilter;
    // optional text search on device/state when searchBy specified
    if (keyword && searchBy === "device") {
      query.device = { $regex: escapeRegex(keyword), $options: "i" };
    } else if (keyword && searchBy === "state") {
      query.newState = { $regex: escapeRegex(keyword), $options: "i" };
    }

    const actions = await Action.find(query)
      .sort({ [sortBy]: typeSort })
      .skip(skip)
      .limit(limit);

    const totalActions = await Action.countDocuments(query);
    return res.status(200).json({
      totalActions,
      totalPages: Math.ceil(totalActions / limit) || 1,
      currentPage: page,
      actions,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
};
