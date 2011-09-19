# See the README for installation instructions.

JS_COMPILER = ./node_modules/uglify-js/bin/uglifyjs
JS_TESTER = ./node_modules/vows/bin/vows

all: \
	static.js

static.js: \
   public/js/jquery-1.6.2.min.js \
   public/js/jquery.hotkeys.js \
   public/js/underscore.js \
   public/js/backbone.js \
   public/js/backbone.goodies.view.js \
   public/js/streamer.js \
   public/js/proper.js \
   public/js/models.js \
   public/js/views.js \
   public/js/controller.js

test: all
	@$(JS_TESTER)

%.min.js: %.js Makefile
	@rm -f $@
	$(JS_COMPILER) < $< > $@

static.js static%.js: Makefile
	@rm -f $@
	cat $(filter %.js,$^) > $@
	@chmod a-w $@

clean:
	rm -f static.js