import Action from "../models/actions.model.js";

const escapeRegex = (s = "") => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const buildDateTimePatterns = (raw = "") => {
  const kw = raw.trim();
  if (!kw) return [];
  const patterns = [];

  // time-only (HH:mm or HH:mm:ss)
  if (kw.includes(":") && !kw.includes("/")) {
    const parts = kw.split(":").map((p) => escapeRegex(p));
    const hh = parts[0] ? `0?${parts[0]}` : "\\d{2}";
    const mm = parts[1] || "\\d{2}";
    const ss = parts[2] || "\\d{2}";
    const tail = parts.length >= 3 ? `:${ss}` : `(?::${ss})?`;
    patterns.push(`${hh}:${mm}${tail}`);
    return patterns;
  }

  // date-only (yyyy/mm/dd or dd/mm/yyyy)
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

export const getActionHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const keyword = req.query.keyword?.trim() || "";
    const sortBy = req.query.sortBy || "timestamp";
    const typeSort = req.query.typeSort === "asc" ? 1 : -1;
    const deviceFilter = (req.query.device || "all").toString();
    const stateFilter = (req.query.state || "all").toString();

    const match = {};
    if (deviceFilter !== "all") match.device = deviceFilter;
    if (stateFilter !== "all") match.newState = stateFilter;

    // 🔍 Nếu có từ khóa (tìm theo ngày / giờ)
    if (keyword) {
      const patterns = buildDateTimePatterns(keyword);
      const orConds = [];

      for (const p of patterns) {
        for (const field of ["timestamp", "createdAt"]) {
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

      match.$or = orConds;
    }

    const pipeline = [
      { $match: match },
      { $sort: { [sortBy]: typeSort } },
      { $skip: skip },
      { $limit: limit },
    ];

    const countPipeline = [{ $match: match }, { $count: "count" }];

    const [actions, countResult] = await Promise.all([
      Action.aggregate(pipeline),
      Action.aggregate(countPipeline),
    ]);

    const totalActions = countResult?.[0]?.count || 0;

    res.status(200).json({
      totalActions,
      totalPages: Math.ceil(totalActions / limit) || 1,
      currentPage: page,
      actions,
    });
  } catch (error) {
    console.error("❌ getActionHistory error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
