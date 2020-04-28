document.addEventListener('DOMContentLoaded', function () {
  // Vars
  const controlPanel = document.querySelector('.control-panel');
  const allCameras = controlPanel.querySelector('.all-cameras');
  let activeVideo = null;

  // Event handlers
  document.querySelectorAll('.video').forEach(function (video) {
    video.addEventListener('click', openFullScreen);
  });

  allCameras.addEventListener('click', closeFullScreen);

  // Functions
  function openFullScreen(e) {
    const { target } = e;
    activeVideo = target;
    target.classList.add('video_fullscreen');
    controlPanel.classList.remove('control-panel_hidden');
  }

  function closeFullScreen() {
    activeVideo.classList.remove('video_fullscreen');
    activeVideo = null;
    controlPanel.classList.add('control-panel_hidden');
  }
})

