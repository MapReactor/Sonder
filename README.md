# Sonder

> Sonder is a neighborhood discovery walking app for IOS and Android built on React Native.

## Team

  - __Product Owner__: George Michel
  - __Scrum Master__: Matt Walsh
  - __Development Team Members__: Aaron Trank, Paige Vogenthaler

## Table of Contents

1. [Usage](#usage)
1. [Requirements](#requirements)
1. [Development](#development)
    1. [Installing Dependencies](#installing-dependencies)
    1. [Tasks](#tasks)
1. [Team](#team)
1. [Contributing](#contributing)

## Requirements

- Node 0.10.x
- Redis 2.6.x
- Postgresql 9.1.x
- React-native 0.38.0

## Development

### Installing Dependencies

From within the root directory:

```sh
npm install
react-native link
```

iOS dependencies:
- *FB Auth*
```sh
npm run ios:install-fb-auth
```

- *Mapbox*<br />
Follow instructions [here](https://github.com/mapbox/react-native-mapbox-gl/blob/master/ios/install.md)<br />
In addition: Add to 'Sonder => Build Settings => Search Paths => Framework Search Paths the below.
```sh
$(PROJECT_DIR)/../node_modules/react-native-mapbox-gl
```

### Roadmap

View the project roadmap [here](https://waffle.io/MapReactor/Sonder)


## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.
