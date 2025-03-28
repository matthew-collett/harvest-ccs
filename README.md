<p align="center">
  <h1 align="center">Harvest Competition Control System</h1>
  <p align="center">
    <img src="app/src/renderer/src/assets/icon.svg" width="300px"/>
  </p>
  
  <p align="center">A competition control system designed for managing The UNB Harvest Competition. It provides real-time monitoring, scoring, and tournament management through a cross-platform desktop application.</p>
  <p align="center"> 
    <a href="https://github.com/matthew-collett/harvest-ccs/releases/latest" target="_blank"><img alt="GitHub release" src="https://img.shields.io/github/release/matthew-collett/harvest-ccs.svg?logo=github&color=blue"></a>
    <a href="https://github.com/matthew-collett/harvest-ccs/actions?workflow=app" target="_blank"><img alt="Build Workflow" src="https://img.shields.io/github/actions/workflow/status/matthew-collett/harvest-ccs/.github%2Fworkflows%2Fapp.yml?label=build&logo=github"></a>
    <a href="https://github.com/matthew-collett/harvest-ccs/blob/main/LICENSE" target="_blank"><img alt="License" src="https://img.shields.io/github/license/matthew-collett/harvest-ccs?label=license&color=orange"></a>
  </p>
</p>

## Table of Contents

- [Harvest Competition Control System](#harvest-competition-control-system)
  - [Table of Contents](#table-of-contents)
  - [Download & Install](#download--install)
  - [Documentation](#documentation)
  - [Contributing](#contributing)
  - [License](#license)

## Download & Install

The latest version of Harvest CCS is available for Windows, macOS, and Linux on the [releases page](https://github.com/matthew-collett/harvest-ccs/releases).

Note: On macOS, you may get "Application Is Damaged and Can’t Be Opened. You Should Move It To The Trash". This is just because I don't want to pay $100 to Apple to have this application notarized. A work-around is to simply run

```bash
`xattr -c '/Applications/Harvest Competition Control System.app'`
```

For more information, see this [thread](https://discussions.apple.com/thread/253714860?sortBy=rank).

## Documentation

All documentation for this project is stored in [`docs/`](docs). The structure is outlined below:

- For informattion about running this application on your local machine, see [`docs/local.md`](docs/local.md).
- For information about the architecture, see [`docs/architecture.md`](docs/architecture.md).
- For information about the serial communication protocol used, see [`docs/serial-protocol.md`](docs/serial-protocol.md).
- For an outline of the user guide, see [`docs/user-guide.md`](docs/user-guide.md).

## Contributing

For guidlines and instructions on contributing, please refer to [CONTRIBUTING.md](CONTRIBUTING.md)

## License

This project is licensed under the ISC License - see the [`LICENSE`](LICENSE) file for details.
