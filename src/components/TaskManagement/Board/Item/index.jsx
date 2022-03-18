import React, { useRef, useState } from 'react';
import PubSub from 'pubsub-js';
import { DRAG_START_EVENT, DRAG_END_EVENT, DEL_DATA_EVENT } from '../../../../Constant';

let disDelBtn = false;
export default function Item(props) {

    const {id, value, allowDel, category, readOnly, dataItemValueChangeFunc} = props;
    const [delVis, setDelVis] = useState(false);
    const inputRef = useRef();

    function onMouseEnterEventCallback(){
        if (!allowDel) return;
        setDelVis(true);
    }

    function onMouseLeaveEventCallback(){
        if (!allowDel) return;
        setDelVis(false);
        disDelBtn = false;
    }

    function onDragStartEventCallback(event){
        PubSub.publish(DRAG_START_EVENT, {itemId: id, category});
        if (delVis){
            disDelBtn = true;
            setDelVis(false);
        }
    }

    function onDragEndEventCallback(){
        PubSub.publish(DRAG_END_EVENT);
        if (disDelBtn){
            setDelVis(true);
        }
    }

    /** item输入完成 */
    function onKeyUpEventCallback(event){
        //是否为回车
        if (event.keyCode !== 13) return;
        const val = inputRef.current.value;
        if (!val){
            delDataItem();
            return;
        }
        dataItemValueChangeFunc(category, id, val);
    }

    function onBlurEventCallback(event){
        if (event.target !== inputRef.current) return;
        const val = inputRef.current.value;
        if (!val){
            delDataItem();
            return;
        }
        dataItemValueChangeFunc(category, id, val);
    }

    function inputOnChange(event){
        dataItemValueChangeFunc(category, id, event.target.value);
    }

    function delDataItem(){
        PubSub.publish(DEL_DATA_EVENT, {
            category,
            itemId: id
        });
    }

    if (props.new){
        setTimeout(() => {
            inputRef.current.focus();
        }, 50);
    }

    return (
        <div 
            >
               <input 
                type="text" 
                readOnly={readOnly} 
                ref={inputRef} 
                value={value || ''}
                onKeyUp={onKeyUpEventCallback} 
                onBlur={onBlurEventCallback}
                onChange={inputOnChange}
                draggable
            onMouseEnter={onMouseEnterEventCallback} 
            onMouseLeave={onMouseLeaveEventCallback} 
            onDragStart={onDragStartEventCallback}
            onDragEnd={onDragEndEventCallback}  />
            {
                delVis ? <input 
                            className='delIconBtn' 
                            type="image" 
                            src='/img/delete.png' 
                            onClick={delDataItem} 
                            name='删除'
                            onMouseEnter={onMouseEnterEventCallback} 
                            onMouseLeave={onMouseLeaveEventCallback}  /> : null
            }
        </div>
    )
}
