document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');
    const videoPlayer = document.querySelector('.video-player');
    const soundPlayer = document.querySelector('.sound-player');
    const playButton = document.querySelector('.play-icon');
    const timeDisplay = document.querySelector('.time-display');
    const outline = document.querySelector('.moving-outline');
    const timeSelectButtons = document.querySelectorAll('.time-button');
    const soundButtons = document.querySelectorAll('.sound-button');

    // Get the length of the outline circle
    const outlineLength = outline.getTotalLength();
    outline.style.strokeDasharray = outlineLength;
    outline.style.strokeDashoffset = outlineLength;

    let fakeDuration = 600; // Default to 10 minutes (600 seconds)
    let isPlaying = false;

    // Set initial play button image
    playButton.src = 'https://i.ibb.co/j32P9x2/play.png'; // Assuming a play icon

    // Initial setup for the first sound and video (e.g., Rain)
    // You might want to default to one of them based on your preference
    soundPlayer.src = 'Sounds/rain.mp3';
    videoPlayer.src = 'Sounds/rain.mp4';
    soundButtons[0].classList.add('active'); // Activate the first sound button

    // Event Listeners for Time Selection
    timeSelectButtons.forEach(button => {
        button.addEventListener('click', function() {
            fakeDuration = parseInt(this.dataset.time);
            timeDisplay.textContent = formatTime(fakeDuration);

            // Remove active class from all time buttons and add to the clicked one
            timeSelectButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Reset playback if changing time while playing
            if (isPlaying) {
                soundPlayer.pause();
                videoPlayer.pause();
                isPlaying = false;
                playButton.src = 'https://i.ibb.co/j32P9x2/play.png';
                outline.style.strokeDashoffset = outlineLength; // Reset progress bar
            }
        });
    });

    // Event Listeners for Sound Selection
    soundButtons.forEach(button => {
        button.addEventListener('click', function() {
            soundPlayer.src = this.dataset.sound;
            videoPlayer.src = this.dataset.video;

            // Remove active class from all sound buttons and add to the clicked one
            soundButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // If playing, restart with new sound/video
            if (isPlaying) {
                soundPlayer.play();
                videoPlayer.play();
            }
        });
    });

    // Play/Pause functionality
    playButton.addEventListener('click', () => {
        if (isPlaying) {
            pauseApp();
        } else {
            playApp();
        }
    });

    function playApp() {
        soundPlayer.play();
        videoPlayer.play();
        playButton.src = 'https://i.ibb.co/nC2L80T/pause.png'; // Assuming a pause icon
        isPlaying = true;
    }

    function pauseApp() {
        soundPlayer.pause();
        videoPlayer.pause();
        playButton.src = 'https://i.ibb.co/j32P9x2/play.png';
        isPlaying = false;
    }

    // Update time display and outline animation
    soundPlayer.ontimeupdate = () => {
        let currentTime = soundPlayer.currentTime;
        let elapsed = fakeDuration - currentTime;
        let progress = outlineLength - (currentTime / fakeDuration) * outlineLength;
        outline.style.strokeDashoffset = progress;

        timeDisplay.textContent = formatTime(elapsed);

        if (currentTime >= fakeDuration) {
            soundPlayer.pause();
            videoPlayer.pause();
            playButton.src = 'https://i.ibb.co/j32P9x2/play.png';
            isPlaying = false;
            soundPlayer.currentTime = 0;
            videoPlayer.currentTime = 0;
            outline.style.strokeDashoffset = outlineLength; // Reset progress bar
            timeDisplay.textContent = formatTime(fakeDuration); // Reset time display
        }
    };

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
        return `${minutes}:${formattedSeconds}`;
    }

    // Initial state: Set 10 minutes as active
    document.getElementById('long-mins').classList.add('active');
    timeDisplay.textContent = formatTime(fakeDuration);
});