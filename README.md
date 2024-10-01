# Generate Acknowledgement file from used Swift Packages

## About

If you use Swift Packages in your project and want to create a record of the
LICENSE files for each package.

We create a *.plist file that you can embed into your app

## Example

```yml
name: Example Workflow

on: [push]

jobs:
  example_job:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Generate plist of all used LICENSES
        uses: nthState/SwiftAcknowledgements
        with:
          SPM_CHECKOUT_DIR: ${{ github.workspace }}/.build/checkouts"
          FILE_NAME: "/some/acknolegements.plist"

```

## Inputs

### `SPM_CHECKOUT_DIR`

**Required** Where the Swift Package Manager files are checked out to

### `FILE_NAME`

**Required** The file name/path that you want to generate

## Outputs

### `PLAIN_TEXT`

If you want to generate the text as plain text, use this option

## Testing

### Docker

Build the docker

```bash
docker build . -t githubactiontest -f Dockerfile
```

Run the docker

```bash
docker run \
-e SPM_CHECKOUT_DIR=path to checkout dir \
-e FILE=Acknowledgements.plist \
-d githubactiontest
```

### Running main.py directly

*Note*: Your path may differ

```bash
export SPM_CHECKOUT_DIR="/Users/chrisdavis/Library/Developer/Xcode/DerivedData/App-gktkfhtswsmjzdhkguhoaotlhihx/SourcePackages/checkouts"
export FILE_NAME="~/Acknowledgements.plist"
python3 main.py

```