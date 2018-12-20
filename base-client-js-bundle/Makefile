base_client_js_url = git@github.com:bitclave/base-client-js.git
# base_client_js_dir = /tmp/base-client-js
base_client_js_dir = ./..

postinstall: update_base_client_js

update_base_client_js:
	rm -rf ./dist/@types
	# git -C $(base_client_js_dir) pull || git clone --branch new-npm-attempt --depth 1 $(base_client_js_url) $(base_client_js_dir)
	npm install --no-save $(base_client_js_dir)/example/public/base-lib/bitclave-base
	cp -r $(base_client_js_dir)/example/public/base-lib/@types ./dist
	rm -rf $(base_client_js_dir)/example/public/base-lib/bitclave-base/node_modules/bitcore-ecies/node_modules/bitcore-lib
	rm -rf $(base_client_js_dir)/example/public/base-lib/bitclave-base/node_modules/bitcore-message/node_modules/bitcore-lib
	rm -rf $(base_client_js_dir)/example/public/base-lib/bitclave-base/node_modules/bitcore-mnemonic/node_modules/bitcore-lib

build:
	rm -rf node_modules/bitclave-base
	npm install
	npm run build
	# rm -rf $(base_client_js_dir)
