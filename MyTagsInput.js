/**
 * Created by varun on 25/7/17.
 */
"use strict"
/**
 * Custom component for tags input
 * - can be used for anytype of field
 * - contains event listeners to do custom operations on events like chip
 */
//TODO custom css, and ways to copy css from sibling input tags
//TODO validator - for eg, email regex, etc
function MyTagsInput(opts){
    var self  = this;
    var self_opts = {
        delim_str : ',',
        return_type : 'array',
        $field : undefined,
        $text_field : undefined,
        actual_value : '',
        array_value : [],
//			ele_attr : {},
        default_values : [],
        onChipIn : function(actual_value, chipped_val, event_key){
            alert(chipped_val);
        },
        onChipOut : function(actual_value, removed_val, event_key){
            alert(removed_val);
        }

    };

    function initAndExecute(){
        jQuery.extend(true, self_opts, opts);

        self_opts.$text_field = jQuery('<input type="text" class="sdp-tags-input">');
//		if(self_opts.ele_attr.classNames){
//			var custom_classes = [];
//			if(typeof self_opts.ele_attr.classNames == 'string'){
//				custom_classes = self_opts.ele_attr.classNames.split(/\\s/);
//			}else{
//				custom_classes = self_opts.ele_attr.classNames;
//			}
//		}

        self_opts.$field = jQuery('<div class="sdp-tags-field" />');
        self_opts.$field.append(self_opts.$text);
        self_opts.$field.on('click', function(){
            self_opts.$text_field.focus();
        });

        var delimiter = new RegExp(self_opts.delim_str);

        if(self.default_values.length > 0){
            for(var i = 0; i < self.default_values.length; i++){
                addChip(self.default_values[i], self_opts.return_type);
            }
        }

        $text_field.on({
            'change paste keyup':function(e){		//will only work in the case of delimiter
                if(e.type == 'keyup' && self_opts.delim_str.indexOf(e.key) != -1){
                    var val = self_opts.$text_field.val().split(delimiter)[0].trim();
                    if(val != ''){
                        self_opts.$text_field.val('');
                        addChip(val);
                    }
                }
                if(e.key != 'Backspace' && e.key != 'Delete'){
                    self_opts.$field.find('.datum.highlight').removeClass('highlight');
                }
            },
            'keydown' : function(e){
                if(e.key == 'Backspace' && self_opts.$text_field.val() == ''){
                    if(self_opts.$text_field.prev().hasClass('highlight')){
                        removeChip(self_opts.$text_field.prev());
                    }else{
                        $text_field.prev().addClass('highlight')
                    }
                }else if(e.key == 'Delete' && self_opts.$text_field.val() == ''){
                    if(self_opts.$text_field.next().hasClass('highlight')){
                        removeChip(self_opts.$text_field.next());
                    }else{
                        self_opts.$text_field.next().addClass('highlight')
                    }
                }else if(e.key == 'ArrowLeft' && self_opts.$text_field.val() == ''){
                    self_opts.$text_field.prev().before(self_opts.$text_field);
                    self_opts.$text_field.focus();
                }else if(e.key == 'ArrowRight' && self_opts.$text_field.val() == ''){
                    self_opts.$text_field.next().after(self_opts.$text_field);
                    self_opts.$text_field.focus();
                }
            }
        });
    };

    function setRemoveAction(){
        self_opts.$field.on('click', '.datum', function(){
            removeChip(this);
        });
    };

    function unsetRemoveAction(){
        self_opts.$field.off('click', '.datum');
    };

    function setValue(){
        var ret;
        if(self_opts.return_format == 'array'){
            ret = self_opts.array_value;
        }else{
            ret = self_opts.array_value.join(',');
        }
        self.onChipIn();
    }

    function addChip(val, ret_format){
        $text_field.before('<span class="datum">'+val+'</span>');
        unsetRemoveAction();
        self.array_value.push(val);
        setValue();
        setRemoveAction();
    };

    function removeChip(tag_ele){
        tag_ele = jQuery(tag_ele);
        var text = tag_ele.get(0).innerText.trim();
        for(var i = 0; i < self.array_value.length; i++){
            if(self.array_value[i] == text){
                self.array_value.splice(i, 1);
                break;
            }
        }
        tag_ele.remove();
        setValue();
    };

    self.onChipIn = self_opts.onChip;
    self.onChipOut = self_opts.onChipOut;
}