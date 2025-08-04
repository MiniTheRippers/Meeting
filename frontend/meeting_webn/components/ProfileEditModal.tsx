import React, { useRef, useState } from "react";

export default function ProfileEditModal({ open, onClose, user, onSave }) {
    const [form, setForm] = useState(user);
    const fileInputRef = useRef(null);

    if (!open) return null;

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                setForm({ ...form, avatar: ev.target.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(form);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-[350px]">
                <h2 className="font-bold mb-4">แก้ไขโปรไฟล์</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <div className="flex justify-center mb-2">
                        <div
                            className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center cursor-pointer overflow-hidden"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {form.avatar ? (
                                <img src={form.avatar} alt="avatar" className="w-full h-full object-cover" />
                            ) : (
                                <span>เลือกรูป</span>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                            />
                        </div>
                    </div>
                    <input
                        className="border rounded px-3 py-2"
                        name="name"
                        placeholder="ชื่อ"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />
                    <input
                        className="border rounded px-3 py-2"
                        name="position"
                        placeholder="ตำแหน่ง"
                        value={form.position}
                        onChange={handleChange}
                        required
                    />
                    <div className="flex gap-2 mt-2">
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded flex-1">
                            บันทึก
                        </button>
                        <button type="button" className="bg-red-500 text-white px-4 py-2 rounded flex-1" onClick={onClose}>
                            ยกเลิก
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
