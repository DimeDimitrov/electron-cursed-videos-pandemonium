# [Deprecated] New lightweight alternative [here](https://github.com/DimeDimitrov/cursed-videos-pandemonium)

# Cursed Videos Pandemonium

Cursed Videos Pandemonium is a simple application built with Electron that lets you open a specified number of cursed videos in different windows simultaneously. It provides a fun and chaotic experience for those who enjoy the weird and unsettling side of internet content.

![banner](https://github.com/DimeDimitrov/cursed-video-pandemonium/assets/129460051/ab13b0ce-f778-41ee-8da8-349a43e1ace5)

Although the project was originally designed for cursed videos, its versatility extends beyond that. Cursed Videos Pandemonium can also be useful in other areas such as:

- Multimedia presentations
- Content creation

- Interactive art installations
- Experimental user experiences
- Exploring juxtaposition of different media

## Features

- Open a specified number of cursed videos in separate windows
- Customize the video URLs and settings via `config.json`
- Adjust the volume level for the videos
- Choose the desired quality for the videos (e.g., low, medium, high)
- Minimise application to tray

## Prerequisites

To run the Cursed Videos Pandemonium application locally, make sure you have the following installed:

- Node.js (version X.X.X)
- npm (version X.X.X)
- (.exe version will be available soon)

## Installation

1. Clone this repository to your local machine:
 ```shell
  git clone https://github.com/DimeDimitrov/electron-cursed-videos-pandemonium.git
 ```
2. Navigate to the project's root directory:
  ```shell
  cd cursed-videos-pandemonium
  ```
3. Install the required dependencies:
  ```shell
  npm install
  ```
  

## Usage

1. Open the `config.json` file located in the project's root directory.

2. Customize the `videos` array by adding or removing cursed video URLs in the desired order.

3. Adjust the `volume` value (ranging from 0 to 1) to set the desired volume level for the videos.

4. Specify the `quality` of the videos (e.g., low, medium, high) based on your preference.

5. Save the `config.json` file.

6. Start the application:
```shell
npm start
```
7. The application will launch multiple windows simultaneously, each playing a cursed video based on the provided configuration.

## Configuration

The `config.json` file contains the following settings:

```json
{
"videos": [
 "https://www.youtube.com/watch?v=ybS7AHGoEI8",
 "https://www.youtube.com/watch?v=2VXacYLcjGA",
 "https://www.youtube.com/watch?v=_nQU_8Nm0Yk",
 "https://www.youtube.com/watch?v=Gnm3hIcjiCQ"
],
"volume": 1,
"quality": "medium"
}
```
   - videos: An array of cursed video URLs. Modify this array to include or remove the desired cursed videos.

   - volume: A number between 0 and 1, representing the volume level for the videos. Adjust this value to control the audio intensity.

   - quality: A string indicating the desired video quality. Choose from "low," "medium," or "high" to determine the playback quality.

## Contributing

Contributions to Cursed Videos Pandemonium are welcome! If you encounter any issues or have ideas for improvements, please open an issue on the GitHub repository. Feel free to fork the repository and submit pull requests with your enhancements.
## License

This project is licensed under the MIT License. You are free to modify and distribute the application in accordance with the terms of the license.
## Acknowledgements

Cursed Videos Pandemonium was created with the help of the following resources:

   - Electron
   - Node.js

## Disclaimer

Please use this application responsibly and be aware of the potential disturbing or unsettling nature of cursed videos. The creator of this application is not responsible for any negative experiences or consequences resulting from the use of Cursed Videos Pandemonium. Use at your own risk.
