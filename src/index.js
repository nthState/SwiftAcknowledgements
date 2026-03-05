const core = require("@actions/core");
const fs = require("fs");
const path = require("path");

function walk(dir, onDir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  onDir(dir, entries);
  for (const e of entries) {
    if (e.isDirectory()) {
      walk(path.join(dir, e.name), onDir);
    }
  }
}

function buildPlist(itemsXml) {
  return `<?xml version="1.0" encoding="UTF-8"?>

<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">

<plist version="1.0">

<dict>

<key>PreferenceSpecifiers</key>

<array>

<dict>

<key>FooterText</key>

<string>This App makes use of the following third party libraries</string>

<key>Title</key>
<string>Acknowledgements</string>

<key>Type</key>

<string>PSGroupSpecifier</string>

</dict>

${itemsXml}

</array>

</dict>

</plist>
`;
}

function escapeLikeOriginal(text) {
  // The python strips < and > to avoid XML problems :contentReference[oaicite:4]{index=4}
  return text.replace(/</g, "").replace(/>/g, "");
}

async function run() {
  try {
    const SPM_CHECKOUT_DIR = core.getInput("SPM_CHECKOUT_DIR", { required: true });
    const FILE_NAME = core.getInput("FILE_NAME", { required: true });

    if (!fs.existsSync(SPM_CHECKOUT_DIR)) {
      core.setFailed(`Swift Package Folder doesnt exist: ${SPM_CHECKOUT_DIR}`);
      return;
    }

    const items = [];

    walk(SPM_CHECKOUT_DIR, (dirpath, entries) => {
      const hasLicense = entries.some(e => e.isFile() && e.name === "LICENSE");
      if (!hasLicense) return;

      const packageName = path.basename(dirpath);
      const licensePath = path.join(dirpath, "LICENSE");

      if (!fs.existsSync(licensePath)) return;

      const licString = escapeLikeOriginal(fs.readFileSync(licensePath, "utf8"));

      core.info(`Package ${packageName}, LICENSE: ${licensePath}`);

      const itemTemplate = `
<dict>

<key>FooterText</key>

<string>${licString}</string>

<key>Title</key>

<string>${packageName}</string>

<key>Type</key>

<string>PSGroupSpecifier</string>

</dict>
`;
      items.push(itemTemplate);
    });

    const template = buildPlist(items.join(""));

    // Output (replacement for deprecated ::set-output used in python) :contentReference[oaicite:5]{index=5}
    core.setOutput("PLAIN_TEXT", template);

    fs.mkdirSync(path.dirname(FILE_NAME), { recursive: true });
    fs.writeFileSync(FILE_NAME, template, "utf8");
  } catch (err) {
    core.setFailed(err instanceof Error ? err.message : String(err));
  }
}

run();