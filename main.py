import os
import sys
from os import walk

class AcknowledgementGenerator():

	def generate(self, SPM_CHECKOUT_DIR, FILE_NAME):
		
		if not os.path.exists(SPM_CHECKOUT_DIR):
			print("Swift Package Folder doesnt exist")
			sys.exit(1) 
		
		content = []
		
		for (dirpath, dirnames, filenames) in walk(SPM_CHECKOUT_DIR):
			if 'LICENSE' in filenames:
				packageName = os.path.basename(os.path.normpath(dirpath))
		
				licensePath = os.path.join(SPM_CHECKOUT_DIR, packageName)
				licensePath = os.path.join(licensePath, "LICENSE")
		
				print("Package {}, LICENSE: {}".format(packageName, licensePath))
				
				if not os.path.exists(licensePath):
					continue
				
				with open (licensePath, "r") as licFile:
					licString = licFile.read().replace('<', '').replace('>', '')
				
				itemTemplate = """
				<dict>
					<key>FooterText</key>
					<string>{license}</string>
					<key>Title</key>
					<string>{name}</string>
					<key>Type</key>
					<string>PSGroupSpecifier</string>
				</dict>
				""".format(license=licString, name=packageName)
				
				content.append(itemTemplate)
		
		contentStr = ''.join(content)
		
		template = """<?xml version="1.0" encoding="UTF-8"?>
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
				{content}
			</array>
		</dict>
		</plist>
		""".format(content=contentStr)
		
		print(f'::set-output name=PLAIN_TEXT::{template}')
		
		with open(FILE_NAME, "w") as plistFile:
			plistFile.write(template)

def main():

	SPM_CHECKOUT_DIR = os.getenv('SPM_CHECKOUT_DIR')
	FILE_NAME = os.getenv('FILE_NAME')
	
	service = AcknowledgementGenerator()
	token = service.generate(SPM_CHECKOUT_DIR, FILE_NAME)

if __name__ == "__main__":
	main()
