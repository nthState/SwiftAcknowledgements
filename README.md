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

### Build and Run

```
npm i
npm run build
```