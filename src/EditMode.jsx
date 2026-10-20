import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { encodeConfigToHash } from './config.js';
import { uploadFile } from './supabaseClient.js';

export default function EditMode({ config, onSave, onPreview }) {
  const [form, setForm] = useState({ ...config });
  const [toast, setToast] = useState('');
  const [toastType, setToastType] = useState('success');
  const [sharedUrl, setSharedUrl] = useState('');
  const [photoUploading, setPhotoUploading] = useState(false);
  const [musicUploading, setMusicUploading] = useState(false);
  const photoInputRef = useRef(null);
  const musicInputRef = useRef(null);

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const showToast = (msg, type = 'success') => {
    setToast(msg);
    setToastType(type);
    setTimeout(() => setToast(''), 2500);
  };

  const handleSave = () => {
    onSave(form);
    showToast('Đã lưu!');
  };

  const handleShare = () => {
    const hash = encodeConfigToHash(form);
    const url = window.location.origin + window.location.pathname + hash;
    setSharedUrl(url);
    showToast('Đã tạo link!');
  };

  const handleCopy = async () => {
    const url = sharedUrl || window.location.origin + window.location.pathname + encodeConfigToHash(form);
    try {
      await navigator.clipboard.writeText(url);
      showToast('Đã sao chép!');
    } catch {
      const ta = document.createElement('textarea');
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      showToast('Đã sao chép!');
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoUploading(true);
    try {
      const url = await uploadFile(file, 'photos');
      update('photoUrl', url);
      showToast('Đã tải ảnh lên!');
    } catch (err) {
      showToast('Lỗi tải ảnh lên', 'error');
    }
    setPhotoUploading(false);
    if (photoInputRef.current) photoInputRef.current.value = '';
  };

  const handleMusicUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMusicUploading(true);
    try {
      const url = await uploadFile(file, 'music');
      update('backgroundMusicUrl', url);
      showToast('Đã tải nhạc lên!');
    } catch (err) {
      showToast('Lỗi tải nhạc lên', 'error');
    }
    setMusicUploading(false);
    if (musicInputRef.current) musicInputRef.current.value = '';
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    borderRadius: 8,
    border: '1px solid #f4b8c2',
    background: '#fff',
    fontSize: 14,
    fontFamily: '"Itim", cursive',
    color: '#2d2a4a',
    outline: 'none',
  };

  const labelStyle = {
    display: 'block',
    fontSize: 13,
    color: '#c9707c',
    marginBottom: 4,
    fontWeight: 600,
  };

  const uploadBtnStyle = {
    padding: '8px 14px',
    borderRadius: 20,
    border: '1px solid #f4b8c2',
    background: '#fff',
    color: '#c9707c',
    fontSize: 13,
    fontFamily: '"Itim", cursive',
    fontWeight: 600,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    flexShrink: 0,
  };

  return (
    <motion.div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgba(255,248,249,0.97)',
        overflowY: 'auto',
        padding: 'env(safe-area-inset-top) 16px env(safe-area-inset-bottom)',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div style={{ maxWidth: 400, margin: '0 auto', paddingTop: 20, paddingBottom: 40 }}>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ fontFamily: '"Dancing Script", cursive', fontSize: 28, color: '#c9707c', fontWeight: 700 }}>
            Tùy chỉnh thiệp
          </div>
          <div style={{ fontSize: 13, color: '#c9707c', opacity: 0.7, marginTop: 4 }}>
            Chỉnh sửa thông tin và chia sẻ
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={labelStyle}>Tên người nhận</label>
            <input
              style={inputStyle}
              value={form.recipientName}
              onChange={(e) => update('recipientName', e.target.value)}
              placeholder="Các chị em đồng nghiệp"
            />
          </div>

          <div>
            <label style={labelStyle}>Tên người gửi</label>
            <input
              style={inputStyle}
              value={form.senderName}
              onChange={(e) => update('senderName', e.target.value)}
              placeholder="Ban Giám đốc"
            />
          </div>

          <div>
            <label style={labelStyle}>Tên công ty</label>
            <input
              style={inputStyle}
              value={form.companyName}
              onChange={(e) => update('companyName', e.target.value)}
              placeholder="Công ty"
            />
          </div>

          <div>
            <label style={labelStyle}>Tiêu đề</label>
            <input
              style={inputStyle}
              value={form.titleText}
              onChange={(e) => update('titleText', e.target.value)}
              placeholder="Happy Womenday"
            />
          </div>

          <div>
            <label style={labelStyle}>Nội dung thư</label>
            <textarea
              style={{ ...inputStyle, minHeight: 200, resize: 'vertical', lineHeight: 1.7 }}
              value={form.letterText}
              onChange={(e) => update('letterText', e.target.value)}
              placeholder="Gửi các chị em đồng nghiệp thân mến,..."
            />
          </div>

          {/* Photo upload */}
          <div>
            <label style={labelStyle}>Hình ảnh</label>
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <input
                style={{ ...inputStyle, flex: 1 }}
                value={form.photoUrl}
                onChange={(e) => update('photoUrl', e.target.value)}
                placeholder="Dán URL hoặc tải ảnh lên"
              />
              <button
                onClick={() => photoInputRef.current?.click()}
                disabled={photoUploading}
                style={uploadBtnStyle}
              >
                {photoUploading ? '⏳' : '📁 Tải ảnh'}
              </button>
              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                style={{ display: 'none' }}
              />
            </div>
            {form.photoUrl && (
              <div style={{ marginTop: 8 }}>
                <img
                  src={form.photoUrl}
                  alt="Xem trước"
                  style={{
                    width: 80,
                    height: 80,
                    objectFit: 'cover',
                    borderRadius: 8,
                    border: '1px solid #f4b8c2',
                  }}
                />
              </div>
            )}
            {!form.photoUrl && (
              <div style={{ fontSize: 12, color: '#c9707c', opacity: 0.6, marginTop: 4 }}>
                Để trống = dùng ảnh mặc định
              </div>
            )}
          </div>

          {/* Music upload */}
          <div>
            <label style={labelStyle}>Nhạc nền (tùy chọn)</label>
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <input
                style={{ ...inputStyle, flex: 1 }}
                value={form.backgroundMusicUrl}
                onChange={(e) => update('backgroundMusicUrl', e.target.value)}
                placeholder="Dán URL hoặc tải nhạc lên"
              />
              <button
                onClick={() => musicInputRef.current?.click()}
                disabled={musicUploading}
                style={uploadBtnStyle}
              >
                {musicUploading ? '⏳' : '🎵 Tải nhạc'}
              </button>
              <input
                ref={musicInputRef}
                type="file"
                accept="audio/*"
                onChange={handleMusicUpload}
                style={{ display: 'none' }}
              />
            </div>
            {form.backgroundMusicUrl && (
              <div style={{ marginTop: 8 }}>
                <audio src={form.backgroundMusicUrl} controls style={{ width: '100%', height: 32 }} />
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
            <button
              onClick={handleSave}
              style={btnStyle('#e8576f', '#fff')}
            >
              Lưu
            </button>
            <button
              onClick={onPreview}
              style={btnStyle('#f4b8c2', '#2d2a4a')}
            >
              Xem trước
            </button>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={handleShare}
              style={btnStyle('#c9707c', '#fff')}
            >
              Tạo link chia sẻ
            </button>
            <button
              onClick={handleCopy}
              style={btnStyle('#f4b8c2', '#2d2a4a')}
            >
              Sao chép link
            </button>
          </div>

          {sharedUrl && (
            <div
              style={{
                background: '#fff',
                border: '1px solid #f4b8c2',
                borderRadius: 8,
                padding: 10,
                fontSize: 12,
                color: '#2d2a4a',
                wordBreak: 'break-all',
                fontFamily: 'monospace',
              }}
            >
              {sharedUrl}
            </div>
          )}
        </div>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            style={{
              position: 'fixed',
              bottom: 40,
              left: '50%',
              transform: 'translateX(-50%)',
              textAlign: 'center',
              background: toastType === 'error' ? '#d64550' : '#e8576f',
              color: '#fff',
              padding: '10px 20px',
              borderRadius: 24,
              fontSize: 14,
              fontFamily: '"Itim", cursive',
              boxShadow: '0 4px 16px rgba(232,87,111,0.4)',
              zIndex: 200,
            }}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function btnStyle(bg, color) {
  return {
    flex: 1,
    padding: '12px 16px',
    borderRadius: 24,
    border: 'none',
    background: bg,
    color,
    fontSize: 14,
    fontFamily: '"Itim", cursive',
    fontWeight: 600,
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(201,112,124,0.25)',
    transition: 'transform 0.15s',
  };
}
