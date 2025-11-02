import React, { useState, useEffect } from "react";
import { Button, Input, Form } from "antd";
import { useInfoContext } from "../../context/infoContext";
import { addReq } from "../../services/addRequest";
import { getReq } from "../../services/getRequeset";
import { patchReq } from "../../services/putRequest"; // smenani yopish uchun
import TextArea from "antd/es/input/TextArea";
import { useNavigate } from "react-router-dom";

export default function Smena() {
  const navigate = useNavigate();
  const { currentUser, warning, error, success } = useInfoContext();

  const [currentShift, setCurrentShift] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Sahifa yuklanganda hozirgi smenani olish
  useEffect(() => {
    fetchCurrentShift();
  }, []);

  // 🔹 Hozirgi faol smenani olish
  const fetchCurrentShift = async () => {
    try {
      const { data } = await getReq("kassa");
      console.log("Kassa list:", data);
      
      const kassaList = Array.isArray(data) ? data : data?.data || [];

      // oxirgi smena yoki yopilmagan smena
      const activeShift = localStorage.getItem("activeShift")

      setCurrentShift(activeShift);

      // agar faol smena bo‘lsa → avtomatik kassaga yo‘naltir
      if (activeShift) {
        // navigate("/cash");
      }
    } catch (err) {
      console.error("Smena olishda xato:", err);
    }
  };

  // 🔹 Smena ochish
  const handleOpenShift = async (values) => {
    setLoading(true);
    try {
      const { data } = await addReq({ xisobot: values }, "kassa");
      localStorage.setItem('activeShift', data.id)
      setCurrentShift(data);
      success("Smena muvaffaqiyatli ochildi!");
      navigate("/cash");
    } catch (err) {
      console.error(err);
      error(err.response?.data?.message || "Smena ochishda xatolik!");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Smenani yopish
  const handleCloseShift = async () => {
    if (!currentShift?.id) return warning("Faol smena topilmadi!");

    setLoading(true);
    try {
      await patchReq(currentShift.id, { isClosed: true }, "kassa");
      setCurrentShift(null);
      success("Smena yopildi!");
    } catch (err) {
      console.error(err);
      error("Smena yopishda xatolik!");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Agar foydalanuvchi tizimga kirmagan bo‘lsa
  if (!currentUser) {
    return (
      <div className="text-center text-red-600 mt-6">
        Avval tizimga kiring!
      </div>
    );
  }

  // 🔹 UI
  return (
    <div className="p-6">
      <h1 className="text-blue-600 text-2xl font-semibold text-center mb-6">
        Kassa Smenasi
      </h1>

      {currentShift ? (
        // ✅ Faol smena holati
        <div className="bg-green-50 p-6 rounded-xl shadow-md text-center">
          <p className="text-lg font-medium mb-2">
            Faol smena: #{currentShift.id}
          </p>
          {currentShift?.xisobot?.izoh && (
            <p className="text-gray-700 mb-1">
              Izoh: {currentShift.xisobot.izoh}
            </p>
          )}
          {currentShift?.xisobot?.kunlik_savdo && (
            <p className="text-gray-700 mb-4">
              Boshlang‘ich summa: {currentShift.xisobot.kunlik_savdo.toLocaleString()} so‘m
            </p>
          )}
          <Button
            danger
            onClick={handleCloseShift}
            loading={loading}
            size="large"
          >
            Smenani yopish
          </Button>
        </div>
      ) : (
        // ✅ Yangi smena ochish formasi
        <Form
          name="openShift"
          onFinish={handleOpenShift}
          layout="vertical"
          className="max-w-md mx-auto p-6 rounded-xl shadow-md border-amber-200"
        >
          <Form.Item
            label="Izoh"
            name="izoh"
            rules={[{ required: true, message: "Izohni kiriting!" }]}
          >
            <TextArea placeholder="Masalan: Ish boshlandi" rows={3} />
          </Form.Item>

          <Form.Item
            label="Boshlang‘ich summa"
            name="kunlik_savdo"
            rules={[{ required: true, message: "Summa kiriting!" }]}
          >
            <Input type="number" placeholder="Masalan: 100000" />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            size="large"
          >
            Smenani ochish
          </Button>
        </Form>
      )}
    </div>
  );
}
