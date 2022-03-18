import React, {useState, useRef, useEffect} from 'react';
import { DROP_EVENT } from '../../../Constant';
import './index.scss';
import Item from './Item';
import PubSub from 'pubsub-js';

let itemId = 0;

export default function Board(props) {

    const {category, containerClassName, headerItemContent, enableAddBtn, addDataItemFunc, data, dataItemValueChangeFunc, readOnly } = props;

    const btnRef = useRef();

    /** item输入完成 */
    function onKeyUpEventCallback(event){
        //是否为回车
        if (event.keyCode !== 13) return;
        
    }

    function onBlurEventCallback(event){
        if (event.target === btnRef.current) return;
    }


    function onDropEventCallback(event){
        PubSub.publish(DROP_EVENT, {category})
    }

    function onDragOverEventCallback(event){
        event.preventDefault();
    }

    function addDataItem(){
        addDataItemFunc(category, {
            id: itemId++,
            allowDel: false
        });
    }

    return (
        <div className={containerClassName}>
            <div className="headerItem">
                {headerItemContent}
            </div>
            <div className='mainItem' 
                 onDrop={onDropEventCallback}
                 onDragOver={onDragOverEventCallback}>
                {
                    data.map(item => {
                        return <Item 
                                    key={item.id} 
                                    {...item} 
                                    category={category} 
                                    dataItemValueChangeFunc={dataItemValueChangeFunc}
                                    readOnly={readOnly}/>
                    })
                }
                {
                    enableAddBtn ? <button className='addDataItemBtn' ref={btnRef} onClick={addDataItem}>添加</button> : null
                }
            </div>
        </div>
    )
}
