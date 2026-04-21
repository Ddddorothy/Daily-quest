import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// 👉 模擬資料庫（之後可以換成真正DB）
let history = [
  { task: "寫作業", time: 120 },
  { task: "讀書", time: 90 },
  { task: "寫報告", time: 180 }
];

// 👉 任務分類函式（簡易AI）
const classifyTask = (task) => {
  const t = task.toLowerCase();

  if (t.includes("報告")) return "report";
  if (t.includes("讀") || t.includes("書")) return "study";
  if (t.includes("作業") || t.includes("功課")) return "homework";
  if (t.includes("運動") || t.includes("跑")) return "exercise";

  return "other";
};

// 👉 預測時間
const estimateTime = (task) => {
  const category = classifyTask(task);

  console.log("分類:", category);

  const filtered = history.filter(
    (item) => classifyTask(item.task) === category
  );
  
  console.log("篩選後:", filtered);

  if (filtered.length === 0) {
    return 60; // 沒資料就預設1小時
  }

  const avg =
    filtered.reduce((sum, item) => sum + item.time, 0) /
    filtered.length;

  return Math.round(avg);
};

// 👉 API：預測時間
app.post("/estimate", (req, res) => {
  const { task } = req.body;

  console.log("目前資料:", history);
  []
  const time = estimateTime(task);

  res.json({
    result: `任務「${task}」預估需要 ${time} 分鐘`
  });
});

// 👉 API：新增歷史（讓系統變聰明）
app.post("/add-history", (req, res) => {
  const { task, time } = req.body;

  history.push({ task, time });

  res.json({ message: "已加入學習資料", history });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});