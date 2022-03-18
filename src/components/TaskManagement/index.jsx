import React, { useEffect, useState } from 'react';
import Board from './Board';
import './index.scss';
import { DROP_EVENT, DRAG_START_EVENT, DRAG_END_EVENT, DEL_DATA_EVENT } from '../../Constant';
import PubSub from 'pubsub-js';

const borardData = [
  { category: 'prepare', containerClassName: 'borderRight', headerItemContent: 'Prepare to study', enableAddBtn: true },
  { category: 'learning', containerClassName: 'borderMiddle', headerItemContent: 'Learning....', readOnly: true },
  { category: 'complete', containerClassName: 'borderLeft', headerItemContent: 'Complete', readOnly: true },
]

let dragItemId = -1;
let dragBorardCate = null;
let dropThis = false;
let dropCate = null;

export default function TaskManagement() {

  const [dataList, setDataList] = useState({
    prepare: [],
    learning: [],
    complete: []
  })

  useEffect(() => {
    PubSub.subscribe(DROP_EVENT, dropEventCallback);
    PubSub.subscribe(DRAG_START_EVENT, dragStartEventCallback);
    PubSub.subscribe(DRAG_END_EVENT, dragEndEventCallback);
    PubSub.subscribe(DEL_DATA_EVENT, delDataItemEventCallback);
    return () => {
      PubSub.unsubscribe(DROP_EVENT, dropEventCallback);
      PubSub.unsubscribe(DRAG_START_EVENT, dragStartEventCallback);
      PubSub.unsubscribe(DRAG_END_EVENT, dragEndEventCallback);
      PubSub.unsubscribe(DEL_DATA_EVENT, delDataItemEventCallback);
    }
  })

  /** 拖拽开始事件回调，主要用于记录拖拽itemid和category */
  function dragStartEventCallback(msg, data) {
    dragItemId = data.itemId;
    dragBorardCate = data.category;
  }

  /** 判断是否drop到了拖拽本身的borard上 */
  function dropEventCallback(msg, data) {
    dropCate = data.category;
    dropThis = dragBorardCate === data.category;
  }

  /** 拖拽结束，用于处理dragItemId */
  function dragEndEventCallback(msg, data) {
    if (dropThis || !dropCate || dropCate === 'prepare') {
      dragItemId = -1;
      dragBorardCate = null;
      dropThis = false;
      dropCate = null;
      return;
    }
    const index = dataList[dragBorardCate].findIndex((item) => {
      return item.id === dragItemId;
    });
    if (index === -1) {
      console.log('未找到DragItemId', dragItemId, dataList);
    }
    else {
      const item = dataList[dragBorardCate][index];
      item.allowDel = true;
      dataList[dropCate].push(item);
      dataList[dragBorardCate].splice(index, 1);
      setDataList({
        prepare: dataList.prepare,
        learning: dataList.learning,
        complete: dataList.complete
      })
    }
    dragItemId = -1;
    dragBorardCate = null;
    dropThis = false;
    dropCate = null;
  }

  function delDataItemEventCallback(msg, data) {
    console.log('delDataItemEventCallback', data)
    const { category, itemId } = data;
    const index = dataList[category].findIndex((item) => {
      return item.id === itemId;
    });
    if (index === -1) {
      console.log('未找到DragItemId', itemId, dataList);
      return;
    }
    dataList[category].splice(index, 1);
    setDataList({
      prepare: dataList.prepare,
      learning: dataList.learning,
      complete: dataList.complete
    })
  }

  function addDataItem(category, obj) {
    obj.new = true;
    dataList[category] = [...dataList[category], obj];
    setDataList({
      prepare: dataList.prepare,
      learning: dataList.learning,
      complete: dataList.complete
    })
    setTimeout(() => {
      obj.new = false;
      setDataList({
        prepare: dataList.prepare,
        learning: dataList.learning,
        complete: dataList.complete
      })
    }, 0);
  }

  function dataItemValueChange(category, itemId, val) {
    const index = dataList[category].findIndex((item) => {
      return item.id === itemId;
    });
    if (index === -1) {
      console.log('未找到DragItemId', itemId, dataList);
      return;
    }
    dataList[category][index].value = val;
    setDataList({
      prepare: dataList.prepare,
      learning: dataList.learning,
      complete: dataList.complete
    })
  }

  return (
    <table className='TaskContainer'>
      <tbody>
        <tr>
          {
            borardData.map(item => {
              return (
                <td key={item.category}>
                  <Board {...item}
                    addDataItemFunc={addDataItem}
                    data={dataList[item.category]}
                    dataItemValueChangeFunc={dataItemValueChange} />
                </td>
              )
            })
          }
        </tr>
      </tbody>
    </table>
  )
}
