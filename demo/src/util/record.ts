/**
 * @description 简单网页录频实现
 * @returns
 */
export default function useRecord() {
  let _mediaRecorder: MediaRecorder | undefined;
  let _stream: MediaStream | undefined;
  let _filename = 'recording';
  const _chunks: Blob[] = [];

  const requestRecord = async () => {
    if (_mediaRecorder) return true;
    try {
      _stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
      _mediaRecorder = new MediaRecorder(_stream);
      console.log('Recording initialized');
      return true;
    } catch (err) {
      console.error('Error: ' + err);
      return false;
    }
  };

  const startRecord = async (filename: string = 'reocording') => {
    _filename = filename;
    if (_mediaRecorder && _stream) {
      _mediaRecorder.ondataavailable = event => {
        _chunks.push(event.data);
      };
      _mediaRecorder.onstop = () => {
        const blob = new Blob(_chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${_filename}.webm`;
        a.click();
        URL.revokeObjectURL(url);
        _chunks.length = 0;
        // 关闭所有媒体轨道
        _stream?.getTracks().forEach(track => track.stop());
        console.log('Recording stoped');
      };
      _mediaRecorder.start();
      console.log('Recording started');
    } else console.error('MediaRecorder is not initialized');
  };

  const stopRecord = async () => {
    if (_mediaRecorder) {
      _mediaRecorder.stop();
    } else console.error('MediaRecorder is not initialized');
  };

  const recordAvailable = () => !!_mediaRecorder;

  return {
    requestRecord,
    startRecord,
    stopRecord,
    recordAvailable,
  };
}
