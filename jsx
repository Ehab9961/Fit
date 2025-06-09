import React, { useState } from "react";

export default function BeboFitApp() {
  const [step, setStep] = useState("home");
  const [userData, setUserData] = useState({
    weight: "",
    height: "",
    age: "",
    activity: "خفيف",
    goal: "تضخيم",
  });
  const [calories, setCalories] = useState(null);
  const [premiumUnlocked, setPremiumUnlocked] = useState(false);
  const [code, setCode] = useState("");
  const [foodName, setFoodName] = useState("");
  const [foodAmount, setFoodAmount] = useState("");
  const [foodResult, setFoodResult] = useState(null);

  const premiumCode = "bebo123";

  // قاعدة بيانات الأكل (لكل 100 جرام)
  const foodDB = {
    "صدور فراخ": { protein: 31, carbs: 0, fat: 3.6 },
    "رز أبيض": { protein: 2.7, carbs: 28, fat: 0.3 },
    "بطاطس": { protein: 2, carbs: 17, fat: 0.1 },
    "بيض": { protein: 13, carbs: 1.1, fat: 11 },
    "سمك سلمون": { protein: 20, carbs: 0, fat: 13 },
    "لبن": { protein: 3.4, carbs: 5, fat: 1 },
  };

  // نشاطات
  const activityLevels = {
    "خفيف": 1.2,
    "متوسط": 1.55,
    "عالي": 1.9,
  };

  // حساب السعرات والماكروز بناءً على هدف المستخدم
  const calculateMacros = () => {
    const weight = parseFloat(userData.weight);
    const height = parseFloat(userData.height);
    const age = parseInt(userData.age);
    if (!weight || !height || !age) {
      alert("من فضلك أدخل الوزن والطول والعمر بشكل صحيح");
      return;
    }

    // حساب BMR (معدل الأيض الأساسي) للذكور (تقدر تعدل لو لازم)
    const bmr = 10 * weight + 6.25 * height - 5 * age + 5;

    // السعرات مع النشاط
    const caloriesWithActivity = Math.round(bmr * (activityLevels[userData.activity] || 1.2));

    // البروتين بناء على هدفك
    let protein;
    if (userData.goal === "تنشيف") protein = weight * 2.2;
    else protein = weight * 1.6; // تضخيم أو غيره

    protein = Math.round(protein);

    // الدهون (مثلاً 25% من السعرات)
    const fatCalories = caloriesWithActivity * 0.25;
    const fat = Math.round(fatCalories / 9);

    // السعرات المتبقية للكارب
    const carbsCalories = caloriesWithActivity - (protein * 4 + fat * 9);
    const carbs = Math.round(carbsCalories / 4);

    setCalories({
      total: caloriesWithActivity,
      protein,
      fat,
      carbs,
      goal: userData.goal,
    });
    setStep("macros");
  };

  const handleCodeSubmit = () => {
    if (code === premiumCode) setPremiumUnlocked(true);
    else alert("كود غير صحيح، حاول مرة تانية");
  };

  const handleFoodCalculate = () => {
    const foodData = foodDB[foodName];
    const amount = parseFloat(foodAmount);
    if (!foodData) {
      alert("الأكل غير موجود في القاعدة، حاول تاني");
      return;
    }
    if (!amount || amount <= 0) {
      alert("ادخل كمية صحيحة");
      return;
    }
    const factor = amount / 100;
    setFoodResult({
      protein: (foodData.protein * factor).toFixed(2),
      carbs: (foodData.carbs * factor).toFixed(2),
      fat: (foodData.fat * factor).toFixed(2),
    });
  };

  // نظام غذائي مخصص بالبريمير حسب السعرات والماكروز
  const premiumMealPlan = () => {
    if (!calories) return null;
    const { protein, carbs, fat, total, goal } = calories;

    // وجبات مقترحة (تقدر تضيف وتعدل)
    return (
      <div>
        <h3 className="text-xl font-bold mb-2">نظامك الغذائي - {goal}</h3>
        <p>السعرات اليومية: <b>{total} كالوري</b></p>
        <p>بروتين: <b>{protein} جرام</b></p>
        <p>دهون: <b>{fat} جرام</b></p>
        <p>كارب: <b>{carbs} جرام</b></p>

        <div className="mt-4 space-y-3">
          <div>
            <h4 className="font-semibold">الفطار:</h4>
            <p>شوفان مع لبن وملعقة زبدة فول سوداني + بيض مسلوق</p>
          </div>
          <div>
            <h4 className="font-semibold">الغداء:</h4>
            <p>صدور فراخ مشوية + أرز أبيض + سلطة خضراء</p>
          </div>
          <div>
            <h4 className="font-semibold">العشاء:</h4>
            <p>سمك مشوي + بطاطس مشوية + خضار سوتيه</p>
          </div>
          <div>
            <h4 className="font-semibold">سناك:</h4>
            <p>لبن زبادي أو مكسرات نيئة</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 space-y-6" style={{ fontFamily: "Arial, sans-serif" }}>
      <h1 className="text-4xl font-bold text-green-400">Bebo Fit</h1>

      {step === "home" && (
        <div className="space-y-4 max-w-md mx-auto">
          <input
            placeholder="الوزن (كجم)"
            type="number"
            value={userData.weight}
            onChange={e => setUserData({ ...userData, weight: e.target.value })}
            className="p-2 rounded w-full text-black"
          />
          <input
            placeholder="الطول (سم)"
            type="number"
            value={userData.height}
            onChange={e => setUserData({ ...userData, height: e.target.value })}
            className="p-2 rounded w-full text-black"
          />
          <input
            placeholder="العمر"
            type="number"
            value={userData.age}
            onChange={e => setUserData({ ...userData, age: e.target.value })}
            className="p-2 rounded w-full text-black"
          />
          <select
            value={userData.activity}
            onChange={e => setUserData({ ...userData, activity: e.target.value })}
            className="p-2 rounded w-full text-black"
          >
            <option>خفيف</option>
            <option>متوسط</option>
            <option>عالي</option>
          </select>
          <select
            value={userData.goal}
            onChange={e => setUserData({ ...userData, goal: e.target.value })}
            className="p-2 rounded w-full text-black"
          >
            <option>تضخيم</option>
            <option>تنشيف</option>
          </select>
          <button onClick={calculateMacros} className="bg-green-500 w-full p-3 rounded font-bold hover:bg-green-600 transition">
            احسب السعرات والماكروز
          </button>

          <button onClick={() => setStep("foodLog")} className="bg-blue-600 w-full p-3 rounded font-bold hover:bg-blue-700 transition">
            إدخال الأكل اليومي
          </button>
          <button onClick={() => setStep("premium")} className="bg-purple-600 w-full p-3 rounded font-bold hover:bg-purple-700 transition
