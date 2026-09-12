serve:
	npm run start

production-build:
	git submodule update --init --recursive
	npm run build

preview-build:
	git submodule update --init --recursive
	HUGO_BASEURL="$(DEPLOY_PRIME_URL)" npm run build
