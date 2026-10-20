const DEFAULT_CONFIG = {
  recipientName: 'Các chị em đồng nghiệp',
  senderName: 'Ban Giám đốc',
  companyName: 'Công ty',
  titleText: 'Happy Womenday',
  letterText: `Gửi các chị em đồng nghiệp thân mến,

Nhân ngày Phụ nữ Việt Nam 20/10, thay mặt tập thể công ty, chúng tôi xin gửi tới các chị em những lời chúc tốt đẹp nhất.

Cảm ơn các chị em đã luôn nỗ lực, tận tâm và sáng tạo trong công việc. Sự đóng góp của các chị em là niềm tự hào của tập thể chúng ta.

Chúng tôi biết các chị em luôn phải cân bằng giữa công việc và gia đình. Sự mạnh mẽ và kiên cường ấy thật đáng trân trọng.

Chúc các chị em luôn dồi dào sức khỏe, ngập tràn hạnh phúc và gặt hái nhiều thành công trong cả sự nghiệp lẫn cuộc sống.

Công ty luôn cam kết xây dựng một môi trường làm việc thân thiện, bình đẳng và đầy sự thấu hiểu.

Chúc các chị em một ngày 20/10 thật ý nghĩa và ngập tràn niềm vui!`,
  photoUrl: '',
  backgroundMusicUrl: '',
};

export const PLACEHOLDER_PHOTO =
  'https://images.pexels.com/photos/54288/pexels-photo-54288.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop';

export function getConfig() {
  const hash = window.location.hash.replace(/^#/, '');
  if (hash) {
    try {
      const decoded = atob(decodeURIComponent(hash));
      const parsed = JSON.parse(decoded);
      return { ...DEFAULT_CONFIG, ...parsed };
    } catch {
      // fall through
    }
  }
  return { ...DEFAULT_CONFIG };
}

export function encodeConfigToHash(config) {
  const json = JSON.stringify(config);
  return '#' + encodeURIComponent(btoa(json));
}

export function isEditMode() {
  const params = new URLSearchParams(window.location.search);
  return params.get('edit') === '1';
}

export { DEFAULT_CONFIG };
