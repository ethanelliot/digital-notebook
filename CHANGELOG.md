# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## 0.0.0 (2026-02-16)


### 🐛 Bug Fixes

* bug where workspace data should be retreaved when navigating from the login ([943c9a5](https://github.com/ethanelliot/digital-notebook/commit/943c9a5f12bd4c9369136811858f2f2c7d2960e6))
* calendar swipe changes time in wrong direction ([d69036c](https://github.com/ethanelliot/digital-notebook/commit/d69036c289d791be99e33d4b0a547d44c76c45da))
* Cleaned up Skeleton gap ([6490410](https://github.com/ethanelliot/digital-notebook/commit/64904106520315b29ccf5a6b0e97b2fd1e612e75))
* dialog action would previosuly close all dialogs. opending dialog would always autofocus on the first element ([e6a7c3c](https://github.com/ethanelliot/digital-notebook/commit/e6a7c3ca0d35ee5ddffec8bdc80c3f10583e997a))
* editor toggles for text style didnt properly toggle. Fixed by moving to use Toggle attribute instead of style class ([80afd72](https://github.com/ethanelliot/digital-notebook/commit/80afd723323f3f50a85e06ffa420b262dc698a2b))
* editor toolbar sticky, use min-h-screen for editor container ([a6a4435](https://github.com/ethanelliot/digital-notebook/commit/a6a4435fb2cc904633642ca4adf322df690171fb))
* Firebase structure changed and moved id and this made some objects provide undefined reference, fixed by getting id from doc when I query. ([f6d7d65](https://github.com/ethanelliot/digital-notebook/commit/f6d7d65f0b2d4309636f85e644f6545e085908ec))
* fixed col label being undefined bug ([ed05d46](https://github.com/ethanelliot/digital-notebook/commit/ed05d464183701b45f2827e621804e4ba96f7553))
* Fixed the content updating of the editor page ([da9d1ae](https://github.com/ethanelliot/digital-notebook/commit/da9d1ae0754ff9141bbc366c332f5b24bca8b48c))
* fixed type on notebook form input ([c21fcd1](https://github.com/ethanelliot/digital-notebook/commit/c21fcd162cdd6a4601ba90057f2bb3f2c445204e))
* gap on notebooks on home page ([934d1b2](https://github.com/ethanelliot/digital-notebook/commit/934d1b29ebc2b713fb5d8b0dd8399ea9b8c9f3b2))
* rename note type File ([24f2186](https://github.com/ethanelliot/digital-notebook/commit/24f2186c2662127b96462943025d441aeeeeb304))
* Style changes to toggle ([206df6d](https://github.com/ethanelliot/digital-notebook/commit/206df6d8f9de0405b1a7e79659ff1fa77da4a5dd))
* Text of button for saving group form was wrong. ([c0b38c7](https://github.com/ethanelliot/digital-notebook/commit/c0b38c7a26ed79bb2dfd309bd8a2f6ea2e577fd8))
* updated firestore settings to avoid experimentalForceLongPolling ([f635474](https://github.com/ethanelliot/digital-notebook/commit/f635474a11c645b695448da9a254186886ba6078))
* Updated the favicon used by PWA to be a png for better quality ([d21f356](https://github.com/ethanelliot/digital-notebook/commit/d21f356b00f0086940295c202b5e7d15c2733428))
* Updated the favicon used by PWA to be a png for better quality ([a022961](https://github.com/ethanelliot/digital-notebook/commit/a022961bd87a605bb5aa71ff886fd6b87c5a4ef7))
* updated the firestore rules for better security and updated hooks to match ([c5671e3](https://github.com/ethanelliot/digital-notebook/commit/c5671e371dc5b302e79d4cf3bb0cee9fdfaf27a0))


### ✨ Features

*  Note Creation and Delete ([6964a56](https://github.com/ethanelliot/digital-notebook/commit/6964a56a153627a7bb2847b482e200944401940f))
* Abstracted out the data-table components to make them more reusable ([23f4554](https://github.com/ethanelliot/digital-notebook/commit/23f4554100df8d997a4a5df5735c8ee3d5adb576))
* Add Button on dashbaord-sidebar ([9936a3a](https://github.com/ethanelliot/digital-notebook/commit/9936a3aa1fcb291b629e37f54c4c23cc3852a057))
* Added basic table ([be1257c](https://github.com/ethanelliot/digital-notebook/commit/be1257c8403746980be60724f62181eb97404f00))
* added dashboard layout and sidebar ([6cc7ac4](https://github.com/ethanelliot/digital-notebook/commit/6cc7ac49c6545fb3e30bbbb5ea4227b7194c32eb))
* Added Favicon ([6da6a32](https://github.com/ethanelliot/digital-notebook/commit/6da6a32b8087ea86a0c6c27e8a669b8b6897293d))
* Added filtering,pagination and column visability for the data table for notes ([a7b292e](https://github.com/ethanelliot/digital-notebook/commit/a7b292e3846d98e18566f97e04a1b2d58e134afe))
* Added Group page ([702345e](https://github.com/ethanelliot/digital-notebook/commit/702345efadb65286ded08e492b48e4e4a220af46))
* Added groupColor to notebook ([d4c892e](https://github.com/ethanelliot/digital-notebook/commit/d4c892eb27cf35a3dbd09b9fc53ba4ff862c15e5))
* Added labels to dashboard sections ([d1210c9](https://github.com/ethanelliot/digital-notebook/commit/d1210c9037d8fbfd91205027ade5137cdc973d75))
* Added note creation on calendar ([0c09b3d](https://github.com/ethanelliot/digital-notebook/commit/0c09b3db878d124643302c7cab05c7fe63c82f4d))
* Added settings page structure ([d2efd33](https://github.com/ethanelliot/digital-notebook/commit/d2efd3379e32b78b1287c266df64ce07257a1dd7))
* Added Update note method and ability to update Status in ui ([6acd85c](https://github.com/ethanelliot/digital-notebook/commit/6acd85cb780b5625da77a26e67522c6bc5b7a703))
* Added useNote hook and context for firebase connectivity ([a8509fa](https://github.com/ethanelliot/digital-notebook/commit/a8509fa0625f35c5190e1af6c0b78a582c50cdee))
* Adds PWA support and updates packages ([a17750a](https://github.com/ethanelliot/digital-notebook/commit/a17750a1b2595d94cf99f9033ad09d2f182f2cca))
* Calendar compoent style and layout ([91e22d4](https://github.com/ethanelliot/digital-notebook/commit/91e22d4dd5e31a6864555fb6e003e9e89c2860d7))
* Colors added to groups as well as in tables and sidebar ([b1a60a8](https://github.com/ethanelliot/digital-notebook/commit/b1a60a8df66bdd2f0181201e7d416d9e82a0a239))
* Data and filter on calendar ([9ffbf17](https://github.com/ethanelliot/digital-notebook/commit/9ffbf170d5fae138628cf32378abf0f2075034cd))
* extracted dashabord data to map ([b3da9af](https://github.com/ethanelliot/digital-notebook/commit/b3da9af92f91d74507cfba402567238733ae8e92))
* Firebase updates when content updates. ([9bf1277](https://github.com/ethanelliot/digital-notebook/commit/9bf12778f2a365415159826e3c49413ad5403d74))
* firebase user auth and protected pages + login ([06370c4](https://github.com/ethanelliot/digital-notebook/commit/06370c4e06c39550eefff99be2f888c4663313fc))
* Improved calendar performance on smaller screens ([1b7d815](https://github.com/ethanelliot/digital-notebook/commit/1b7d815a9cda00983adde6dbbb841847741ceb22))
* Made editor compatable for smaller screen sizes ([2e350b0](https://github.com/ethanelliot/digital-notebook/commit/2e350b05b0eed93d128bed04e1f93a16d12ec8d2))
* Notebook form for edit and delete ([67c54cb](https://github.com/ethanelliot/digital-notebook/commit/67c54cb59f9b77ebbd13a40ecd47df47db9f0b5c))
* Notebook name saving and Improved error handling ([de398ac](https://github.com/ethanelliot/digital-notebook/commit/de398acf55fdcb5edd2ef55354c8dd0ccf7b9e12))
* On smaller screens improved calendar screen usability by adding drawer ([b82bac8](https://github.com/ethanelliot/digital-notebook/commit/b82bac8af59c5553071430997d1e9ca02f4ad283))
* Optimised note table for smaller screens ([8de35cd](https://github.com/ethanelliot/digital-notebook/commit/8de35cda413920db31b9fe7a4c10b5394a1299fa))
* optimised table for tablets ([a5a09a9](https://github.com/ethanelliot/digital-notebook/commit/a5a09a929ecd142d7f3736553251303bb87eebb5))
* Skelton for loadin of calendar ([ea5930d](https://github.com/ethanelliot/digital-notebook/commit/ea5930da0ac002a4367ca7881a95402c7551be7a))
* Swipe on calendar on phone screen ([37534bd](https://github.com/ethanelliot/digital-notebook/commit/37534bdc3fc3db75ecc9544bf00555cbb3514d7f))
* Toggle sidebar when menu buttons are clicked ([cb86554](https://github.com/ethanelliot/digital-notebook/commit/cb8655475d0563317533bffc1403bbc79deb926e))
* Updated to use groups for all notes and notebooks. ([6ab92ff](https://github.com/ethanelliot/digital-notebook/commit/6ab92ff7491f4b5eb19a627eb7218e6a02c610c3))
* user button and nav as well as dropdown. ([2d9fb65](https://github.com/ethanelliot/digital-notebook/commit/2d9fb6598deb0dec02eb6fa2de7c112bebb92a7d))
