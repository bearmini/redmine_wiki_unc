(function () {
  if(typeof jsToolBar === 'undefined') return false;
    
  // Create button
  var modalHtml = '<h3 class="title">Insert link</h3>'
                + '<p>'
                +   'Address<br>'
                +   '<input type="text" name="address" style="width:100%" id="js-redmine-wiki-unc-input-address"><br>'
                +   '<span style="float:right"><a href="javascript:void(0)" id="js-redmine-wiki-unc-a-try-link">Try link</a></span>'
                + '</p>'
                + '<p>Text to display<br><input type="text" name="address" style="width:100%" id="js-redmine-wiki-unc-input-text"></p>'
                + '<p class="buttons">'
                +   '<input type="button" value="OK"     id="js-redmine-wiki-unc-button-ok" disabled> '
                +   '<input type="button" value="Cancel" id="js-redmine-wiki-unc-button-cancel">'
                + '</p>';
                  
  var getCleanedAddress = function(inputAddress) {
    return inputAddress.val().replace(/"/g, '').trim();
  };
  var getEncodedAddress = function(inputAddress) {
    return getCleanedAddress(inputAddress).replace(/ /g,  '%20')
                                          .replace(/\(/g, '%28')
                                          .replace(/\)/g, '%29');
  };
  var isInputValid = function(inputAddress) {
    return getCleanedAddress(inputAddress) != '';
  };
                  
  var button = {
    title: 'Insert link',
    type:  'button',
    name:  'wiki_unc',
    class: 'jstb_wiki_unc',
    fn: {
      wiki: function() {
        $('#ajax-modal').html(modalHtml);
        var that = this;
        var inputAddress = $('#js-redmine-wiki-unc-input-address');
        var inputText    = $('#js-redmine-wiki-unc-input-text');
        var tryLink      = $('#js-redmine-wiki-unc-a-try-link');
        var buttonOk     = $('#js-redmine-wiki-unc-button-ok');
        var buttonCancel = $('#js-redmine-wiki-unc-button-cancel');
        
        inputAddress.keyup(function(){
          if (isInputValid(inputAddress)) {
            buttonOk.prop('disabled', false);
            tryLink.attr('href', getCleanedAddress(inputAddress));
            tryLink.attr('target', '_blank');
          } else {
            buttonOk.prop('disabled', true);
            tryLink.attr('href', 'javascript:void(0)');
            tryLink.removeAttr('target');
          }
        });
        inputAddress.keypress(function(e){
          if (e.keyCode === 13) { // 13 is enter
            if (isInputValid(inputAddress)) {
              buttonOk.trigger('click');
              return false; // Return false to prevent to insert new line
            }
          }
        });
        inputText.keypress(function(e){
          if (e.keyCode === 13) { // 13 is enter
            if (isInputValid(inputAddress)) {
              buttonOk.trigger('click');
              return false; // Return false to prevent to insert new line
            }
          }
        });
        buttonOk.click(function(){
          if (!isInputValid(inputAddress)) {
            return;
          }
          hideModal(this);
          
          var address = getCleanedAddress(inputAddress);
          var text    = inputText.val().trim();
          if (text == '') {
            text = address;
          }
          
          var link;
          if (/^\\\\/.test(address)) {
            if (address == text) {
              link = '{{unc(' + address + ')}}';
            } else {
              link = '{{unc(' + address + ', ' + text + ')}}';
            }
          } else {
            var encoded = getEncodedAddress(inputAddress);
            if (encoded == text) {
              link = ' ' + encoded + ' ';
            } else {
              var textFormatting = $('#js-redmine-wiki-unc-script-tag').data('text-formatting');
              if (textFormatting == 'markdown') {
                link = ' [' + text + '](' + encoded + ') ';
              } else {
                link = ' "' + text + '":' + encoded + ' ';
              }
            }
          }
          
          var pos    = that.textarea.selectionStart;
          var scroll = that.textarea.scrollTop;
          var left   = that.textarea.value.substring(0, pos);
          var right  = that.textarea.value.substring(pos);
          that.textarea.value     = left + link + right;
          that.textarea.scrollTop = scroll;
          that.textarea.selectionStart = that.textarea.selectionEnd = (left + link).length;
        });
        buttonCancel.click(function(){
          hideModal(this);
        });

        $('#ajax-modal').off('dialogclose'); // If "off" is not executed, the event is added many times.
        showModal('ajax-modal', '60%');
        $('#ajax-modal').on('dialogclose', function(event) {
          that.textarea.focus();
        });
      }
    }
  };

  // Recreate toolbar
  var elements_new = {};
  for (var i in jsToolBar.prototype.elements) {
    elements_new[i] = jsToolBar.prototype.elements[i];
    if (i == 'img') { // Insert new button after the image button.
      elements_new['wiki_unc'] = button;
    }
  }
  jsToolBar.prototype.elements = elements_new;
}());
