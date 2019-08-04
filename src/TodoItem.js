import React, { Component } from 'react';
import PropTypes from 'prop-types';

const STATUS_READ = true;
const STATUS_EDIT = false;

class TodoItem extends Component {

  constructor (props) {
    super(props);
    this.state = {
      inputValue: this.props.content,
      readStatus: STATUS_READ
    };

    this.handleItemStatusChange = this.handleItemStatusChange.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
    this.handleContentClick = this.handleContentClick.bind(this);
    this.handleContentEdit = this.handleContentEdit.bind(this);
    this.handleInputBlur = this.handleInputBlur.bind(this);
    this.handleDidInput = this.handleDidInput.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.content === this.props.content && nextState.readStatus && nextState.readStatus === this.state.readStatus) {
      return false;
    }
    return true;
  }

  /**
   * 时间：组件重新渲染后调用，在初始化渲染的时候该方法不会被调用。
   * 作用：使用该方法可以在组件更新之后操作DOM元素。
   */
  componentDidUpdate (prevProps, prevState) {
    if (prevState.readStatus !== this.state.readStatus) {
      this.input && this.input.select();
    }
  }

  handleInputBlur () {
    const {onEdit, index, type} = this.props;
    onEdit(this.state.inputValue, index, type);
    this.setState(() => ({readStatus: STATUS_READ}));
  }

  handleDidInput (e) {
    if (e.keyCode === 13) {
      this.handleInputBlur();
    }
  }

  handleDeleteClick () {
    const {onDelete, index, type} = this.props;
    onDelete(index, type);
  }

  handleItemStatusChange () {
    const {onFinish, index, type} = this.props;
    onFinish(index, type);
  }

  handleContentClick () {
    if (this.state.readStatus) {
      this.setState(() => ({readStatus: STATUS_EDIT}));
    }
  }

  handleContentEdit (e) {
    const value = e.target.value;
    this.setState(() => ({inputValue: value}));
  }

  render() {

    const { itemId, done } = this.props;
    const { handleInputBlur, handleDidInput, handleItemStatusChange, handleDeleteClick, handleContentEdit } = this;
    const { readStatus, inputValue } = this.state;
    return (
      <li 
        className="item" 
        id={itemId} 
        draggable={true} 
      >
        <input type="checkbox" className="checkbox" onChange={handleItemStatusChange} checked={done}/>
        <p className="text" onClick={this.handleContentClick}>
          { 
            readStatus ? inputValue : <input 
                ref={(input) => {this.input = input}} 
                onKeyUp={handleDidInput}
                value={inputValue} 
                onBlur={handleInputBlur} 
                onChange={handleContentEdit}
              />
          }
          </p>
        <span className="del-btn" onClick={handleDeleteClick}>-</span>
      </li>
    );
  }
}

TodoItem.propTypes = {
  type: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  done: PropTypes.bool.isRequired,
  content: PropTypes.string.isRequired,
  onDelete: PropTypes.func,
  onFinish: PropTypes.func,
  onEdit: PropTypes.func
}

TodoItem.defaultProps = {
  draggable: true
}

export default TodoItem;