/*!
 * jQuery simpleflowchart
 * Author: @ahmadalfy
 * Version: 1.0.1
 * Licensed under the MIT license
 */

;(function ( $, window, document, undefined ) {

  var pluginName = 'simpleflowchart',
      defaults = {
        data: [],
        wrapperClass: 'chart-wrapper',
        startClass: 'node__start',
        informativeClass: 'node__informative',
        nodeClass: 'node__question',
        finishClass: 'node__finish',
        startingPoint: 1
      };

  function Plugin( element, options ) {

    this.element = element;

    this.options = $.extend( {}, defaults, options) ;

    this._defaults = defaults;
    this._name = pluginName;

    // Initialize the plugin only when if the data exist
    if ($.isArray(this.options.data) && this.options.data.length > 0) {
      this.init();
    }
  }

  Plugin.prototype = {

    init: function() {
      this.createWrapper();
      this.createNode({ link: this.options.startingPoint });
    },

    createWrapper: function() {
      this.$wrapper = $('<div class="' + this.options.wrapperClass + '" />');
      // It's a good practice to include an alternative version
      // for people with JavaScript disabled like an alternative
      // static image or a link to the chart in a different format
      $(this.element).html(this.$wrapper);
    },

    triggerCreateNode(ev) {
      var data = ev.data;
      data.$currentNode.closest('.node-wrapper').nextAll().remove();
      this.createNode(data);
    },

    createNode: function(data) {
      var node = this.options.data.find(function(node) {
        return node.id === data.link;
      });
      if(node === undefined) {
        throw new Error('Error, couldn\'t find a node with the id: ' + data.link);
      }
      var $node = $('<div class="node-wrapper" />');
      this.addNodeClasses(node, $node);
      var $nodeText = this.createNodeText(node);
      $node.append($nodeText);
      if ($.isArray(node.answers) && node.answers.length > 0) {
        var $answers = this.createAnswers(node.answers);
        $node.append($answers);
      }
      this.$wrapper.append($node);
      if(node.informative && node.link !== undefined) {
        this.createNode({ link: node.link });
      }
    },

    addNodeClasses: function(nodeData, $el) {
      if (nodeData['class'] !== undefined) {
        $el.addClass(nodeData['class']);
      } else if (!nodeData.informative && !nodeData.start && !nodeData.finish) {
        $el.addClass(this.options.nodeClass);
      }
      if (nodeData.informative) {
        $el.addClass(this.options.informativeClass);
      }
      if (nodeData.start) {
        $el.addClass(this.options.startClass);
      }
      if (nodeData.finish) {
        $el.addClass(this.options.finishClass);
      }
    },

    createNodeText: function(data) {
      return $nodeText = $('<div class="node">' + data.text + '</div>');
    },

    createAnswers: function(answers) {
      var $answersWrapper = $('<ul class="node__answers" />');
      var $answer = $('<li class="node__answer" />');
      var answersCount = answers.length;
      var that = this;
      $.each(answers, function(idx, answer) {
        var $thisAnswer = $answer.clone();
        $thisAnswer.css('width', (100/answersCount) + '%');
        if (answer['class'] !== undefined) {
          $thisAnswer.addClass(answer['class']);
        }
        $answerAction = $('<button class="node__action" type="button" />');
        $answerAction.bind('click', { link: answer.link, $currentNode: $answerAction }, that.triggerCreateNode.bind(that));
        $answerAction.text(answer.text);
        $answersWrapper.append($thisAnswer.append($answerAction));
      });
      return $answersWrapper;
    }

  };

  // Lightweight wrapper around the constructor,
  // preventing against multiple instantiations
  $.fn[pluginName] = function ( options ) {
    return this.each(function () {
      if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" + pluginName,
        new Plugin( this, options ));
      }
    });
  };
})( jQuery, window, document );
