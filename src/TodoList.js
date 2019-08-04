import React, { Component, Fragment } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import cookie from 'react-cookies';
import TodoItem from './TodoItem';
import './style.css';


const COOKIES_MAX_AGE = 100 * 365 * 24 * 60 * 60;
const TYPE_DONE = 'DONE';
const TYPE_TODO = 'TODO';
const KEY_DEFAULT_PREFIX = 'key-';
var keyDefaultUniqueVal = 0;

class TodoList extends Component {

  constructor (props) {
    super(props);
    let doneList = cookie.load('donelist');
    let todoList = cookie.load('todolist');

    todoList = (typeof todoList === 'undefined') ? [] : todoList;
    doneList = (typeof doneList === 'undefined') ? [] : doneList;

    for (let item of [...todoList, ...doneList]) {
      if (item.key > keyDefaultUniqueVal) {
        keyDefaultUniqueVal = item.key;
      }
    }
    if (keyDefaultUniqueVal > 0) {
      keyDefaultUniqueVal++;
    }

    this.state = {
      todoList: todoList,
      doneList: doneList,
      inputValue: ''
    };
    this.handleValueChange = this.handleValueChange.bind(this);
    this.handleAddItem = this.handleAddItem.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleFinish = this.handleFinish.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleClear = this.handleClear.bind(this);
  }

  decorateKeyValue (val, prefix) {
    const p = prefix && typeof prefix === 'string' ? prefix : KEY_DEFAULT_PREFIX;
    return '' + p + val;
  }

  genKeyValue () {
    return keyDefaultUniqueVal++;
  }

  componentDidUpdate () {
    const { todoList, doneList } = this.state;
    cookie.save('donelist', doneList, {maxAge: COOKIES_MAX_AGE});
    cookie.save('todolist', todoList, {maxAge: COOKIES_MAX_AGE});
  }

  handleValueChange (e) {
    this.setState({
      inputValue: e.target.value
    });
  }

  handleAddItem (e) {
    if (e.keyCode === 13) {
      const inputValue = this.state.inputValue;
      if (inputValue === '') {
        alert('please input something!');
        return;
      }
      this.setState(() => ({
        todoList: [...this.state.todoList, {value: inputValue, key: this.genKeyValue()}],
        inputValue: ''
      }));
    }
  }

  handleDelete (index, type) {
    if (TYPE_TODO === type) {
      const list = [...this.state.todoList];
      list.splice(index, 1);
      this.setState({
        todoList: list
      });
    } else if (TYPE_DONE === type) {
      const list = [...this.state.doneList];
      list.splice(index, 1);
      this.setState({
        doneList: list
      });
    }
  }

  handleFinish (index, type) {
    let todoList = [...this.state.todoList];
    let doneList = [...this.state.doneList];
    if (type === TYPE_DONE) {
      const tempList = doneList.splice(index, 1);
      todoList = [...todoList, ...tempList];
    } else if (type === TYPE_TODO) {
      const tempList = todoList.splice(index, 1);
      doneList = [...doneList, ...tempList];
    }

    this.setState({
      todoList: todoList,
      doneList: doneList
    });
  }

  handleClear () {
    this.setState(() => ({
      todoList: [],
      doneList: [],
      inputValue: ''
    }), () => {
      keyDefaultUniqueVal = 0;
    });
  }

  handleEdit (content, index, type) {
    if (!content || content === '') {
      alert('please input something!');
      const todoList = [...this.state.todoList];
      const doneList = [...this.state.doneList];
      this.setState({
        todoList: todoList,
        doneList: doneList
      });
    } else {
      if (type === TYPE_TODO) {
        const list = [...this.state.todoList];
        list[index].value = content;
        this.setState({
          todoList: list
        });
      } else if (type === TYPE_DONE) {
        const list = [...this.state.doneList];
        list[index].value = content;
        this.setState({
          doneList: list
        });
      }
    }
  }

  showTodoItems() {
    const { todoList } = this.state;
    return (
      <TransitionGroup>{
        todoList.map((item, index) => (
          <CSSTransition
            key={this.decorateKeyValue(item.key)}
            timeout={500}
            classNames="fade"
            appear={true}
          >
            <TodoItem 
              type={TYPE_TODO}
              index={index}
              content={item.value} 
              done={false}
              onDelete={this.handleDelete}
              onFinish={this.handleFinish}
              onEdit={this.handleEdit}
            />
          </CSSTransition>
        ))
      }</TransitionGroup>
    )
  }

  showDoneItems() {
    const { doneList } = this.state;
    return (
      <TransitionGroup>
      {
        doneList.map((item, index) => (
          <CSSTransition
            key={this.decorateKeyValue(item.key)}
            timeout={500}
            classNames="fade"
            appear={true}
          >
            <TodoItem
              key={this.decorateKeyValue(item.key)}
              type={TYPE_DONE}
              index={index}
              done={true}
              content={item.value}
              onDelete={this.handleDelete}
              onFinish={this.handleFinish}
              onEdit={this.handleEdit}
            />
          </CSSTransition>
        ))
      }
      </TransitionGroup>
    );
  }

  render () {
    return (
      <Fragment>
        <div className="header">
          <div className="section header-section">
            <span className="left main-title">ToDoList</span>
            <div className="right">
              <input className="add-input-box" placeholder="添加ToDo" value={this.state.inputValue} onChange={this.handleValueChange} onKeyUp={this.handleAddItem}/>
            </div>
          </div>
        </div>
        <div className="content">
          <div className="section list-section">
            <span className="left title">正在进行</span><span className="right count">{this.state.todoList.length}</span>
            <ul className="list todo-list">
              {this.showTodoItems()}
            </ul>
          </div>
          <div className="section list-section">
            <span className="left title">已经完成</span><span className="right count">{this.state.doneList.length}</span>
            <ul className="list done-list">
              {this.showDoneItems()}
            </ul>
          </div>
        </div>
        <div className="footer">
          <div className="section footer-section">
            <span className="copyright">Copyright © 2019 qiang</span>
            <span className="clear-btn" onClick={this.handleClear}>clear</span>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default TodoList;