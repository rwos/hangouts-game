SHELL=/bin/bash

all: index.xml

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

index.html: src/index.html src/main.js src/main.css
	sed -e '/INCLUDE JS/{r src/main.js' -e 'd}' \
		-e '/INCLUDE CSS/{r src/main.css' -e 'd}' \
		-e 's!INCLUDE GITREF!<a href="https://github.com/rwos/hangouts-game">v'`git log --oneline | wc -l`'.0</a>!' \
		$< > $@

index.xml: src/index.xml index.html
	sed -e '/INCLUDE EVERYTHING/{r index.html' -e 'd}' \
		$< > $@
