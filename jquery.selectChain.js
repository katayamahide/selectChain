/*
 * SelectChain - jQuery select box plugin
 *
 * Copyright (c) 2021 Hide Katayama
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Version: 1.0.0
 *
 */


;(function($) {
"use strict";

  $.fn.selectChain = function (childSelectBox)
  {

    // 親セレクトボックス（以下、親）
    let parentSelectBox = this;

    parentSelectBox.each(function()
    {
      // 親が変更されたときに発火します
      $(this).change(function(e) 
      {
        // 子セレクトボックス（以下、子）を更新するメソッドを実行します
        updateChildSelectBox(childSelectBox);

        // 子にchangeイベントを仕組みます
        $(childSelectBox).trigger('change');
      });
    })
    // 子セレクトボックス（以下、子）を更新するメソッドを実行します
    updateChildSelectBox(childSelectBox);

    /**
     * 子を更新するメソッドを提供します
     * 
     * @param childSelectBox 
     */
    function updateChildSelectBox(childSelectBox)
    {
      // 子がセッションなどで既に選択済みの場合はそのままにし、
      // それ以外の場合は、子の最初のオプション(=デフォルト値)を表示・選択済みにします。
      if (String($('option:selected', childSelectBox).data('parent')) !== $(parentSelectBox).val())
      {
        $(childSelectBox).children().first().show().prop('selected', true);
      }

      // 親の値を配列に格納します
      let parentValArray = [];
      $(parentSelectBox).each((index, parent) => parentValArray.push($(parent).val())); 

       // 子オプションのうち、親の値と同じデータ値を持つものだけを表示します
      $(childSelectBox).children().not(':first').each((index, childOption) =>
      {
        // 子オプションのデータ値を配列に格納します
        let childDataArray = [];
        childDataArray = $(childOption).data('parent').split(' ');

        if (isArrayMatch(parentValArray, childDataArray))
        {
          // 一致の場合、表示
          $(childOption).show();
        }
        else
        {
          // 不一致の場合、非表示
          $(childOption).hide().attr('selected', false);
        }
      });

      // 子のオプションがデフォルト値のみだった場合、非表示にします
      if ($('option', childSelectBox).not('[style*="display: none"]').length === 1 && $(childSelectBox).val() === "")
      {
        $(childSelectBox).prop("disabled", true);
      }
      else
      {
        $(childSelectBox).prop("disabled", false);
      }
    }
  };

  /**
   * 配列同士を比較して、同じ値が含まれているかどうかを真偽で返します
   * 
   * @param array array1 
   * @param array array2 
   * @returns bool 
   */

  function isArrayMatch(array1, array2) {
    return [...array1, ...array2].filter( function (item)
    {
      return array1.includes(item) && array2.includes(item)
    }).length > 0
  }

})(jQuery);