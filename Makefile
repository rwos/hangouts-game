SHELL=/bin/bash

all: index.xml

watch:
	while true; do $(MAKE) local.html ; sleep 0.5; done

run: local.html
	xdg-open local.html || open local.html

deploy:
	test -z "${TRAVIS}" && exit 1 || exit 0 # let travis take care of this
	@git clone -b gh-pages "https://${GH_TOKEN}@${GH_REF}" LIVE > /dev/null 2>&1 || exit 1
	$(MAKE) index.xml
	cd LIVE; \
		git config user.email "ossdeploymeister@users.noreply.github.com"; \
		git config user.name "DEPLOY MEISTER"; \
		mv ../index.xml ./; \
		git add .; \
		git commit --allow-empty -m "deploy: ${TRAVIS_COMMIT_MSG}"; \
		git push origin gh-pages > /dev/null 2>&1 || exit 1;

local.html: src/index.html src/main.js src/game.js src/main.css Makefile
	sed -e '/INCLUDE JS/{r src/game.js' -e 'r src/main.js' -e 'd}' \
		-e '/INCLUDE CSS/{r src/main.css' -e 'd}' \
		-e 's!INCLUDE GITREF!<a href="https://github.com/rwos/hangouts-game">v'`git log --oneline | wc -l`'.0</a>!' \
		$< > $@

index.html: local.html 3rd/htmlminifier
	test -z "${TRAVIS}" && exit 1 || exit 0 # let travis take care of this
	3rd/htmlminifier/cli.js --minify-css --minify-js --remove-comments --collapse-whitespace $< > $@

index.xml: src/index.xml index.html
	sed -e '/INCLUDE EVERYTHING/{r index.html' -e 'd}' \
		$< > $@

3rd/htmlminifier:
	git clone https://github.com/kangax/html-minifier.git $@
	cd $@ && npm install
