import React, { Component } from 'react';
import './App.css';
import { Anchor, Button, Modal} from 'antd';
import _ from 'lodash';
import {letterList} from './config';
import {list1, list2, list3, list4, list5, list6, list7, list8, list9, list10, list11, list12, list13, list14, list15} from './wordlist-es';
import RenderOneWord from './newRenderWord2';
import {getFirstWord, getDayKey} from './tools';


export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
        cardVisible: false,
        // currentWord: null,
        firstWords: [],
        viewVisible: false
    };
  }

  componentDidMount() {
    const firstWords = getFirstWord();
    const yesterday = getDayKey('yesterday');
    const today = getDayKey();
    if (localStorage.getItem(yesterday)) {
        if (!localStorage.getItem(today)) {
            localStorage.removeItem(yesterday);
            localStorage.setItem(today, '{}');
        }
    }
    else {
        if (!localStorage.getItem(today)) {
            localStorage.setItem(today, '{}');
        }
    }
    this.setState({
        firstWords
    });
    const scrollElement = document.getElementById('time-line');
    const anchorElement = document.getElementsByClassName("current-time-line")?.[0];
    if (scrollElement && anchorElement) {
        scrollElement.scrollTo({ top: anchorElement.offsetTop + 2, behavior: "smooth" });
    }
  }

//   componentDidUpdate(prevProps, prevState) {
//     const today = getDayKey();
//     const currenWordsInfo = localStorage.getItem(today);
//     if (prevProps.word !== this.props.word) {
//         this.requireInfo(this.props.word);
//     }
//   }

  onClickWord = word => {
    this.setState({
        cardVisible: true,
        // currentWord: word
    });
    localStorage.setItem('currentWord', word);
    // localStorage.setItem('startTime', new Date().getTime());
  }

  onClickView = () => {
    this.setState({viewVisible: true});
  }

  onCloseView = () => {
    this.setState({viewVisible: false});
  }

  render() {
    const list = list1.concat(list2, list3, list4, list5, list6, list7, list8, list9, list10, list11, list12, list13, list14, list15).sort();
    const {
        cardVisible,
        // currentWord,
        firstWords,
        viewVisible
    } = this.state;
    const currentWord = localStorage.getItem('currentWord');
    const today = getDayKey();
    const todayWords = JSON.parse(localStorage.getItem(today)) || {};
    const validWords = Object.keys(todayWords).filter(item => {
        const num = Number(todayWords[item]);
        return num > 40 * 1000 && num < 5 * 60 * 1000;
    });
    return (
        <div className="App">
            <div className='word-content'>
                {cardVisible && <RenderOneWord word={currentWord} />}
            </div>
            <div className='time-line' id="time-line">
                {list.map(word => {
                    let id = null;
                    const index = _.findIndex(firstWords, item => item.word === word);
                    if (index > -1) {
                        id = firstWords[index].letter;
                    }
                    return (
                        <div className={`time-line-word-item-container ${word === currentWord ? 'current-time-line' : ''}`} id={id}>
                            <span className={`time-line-word-item-dot ${word === currentWord ? 'time-line-word-item-dot-red' : ''}`}></span>
                            <div className={`time-line-word-item ${word === currentWord ? 'time-line-word-item-red' : ''}`} onClick={_.partial(this.onClickWord, word)}>{word}</div>
                        </div>
                    );
                })}
            </div>
            <div className='quick-menu'>
                <Anchor
                    items={letterList.map(letter => ({
                        key: letter,
                        href: `#${letter}`,
                        title: <div style={{fontSize: '14px', fontWeight: 'bold'}}>{letter}</div>
                    }))}
                />
            </div>
            <div className='btn-container'>
                <Button onClick={this.onClickView} type="link">今天背了多少单词?</Button>
            </div>
            <Modal title="今日单词情况" open={viewVisible} onOk={this.onCloseView} onCancel={this.onCloseView}>
                <div className="all-words-info">
                    <p>今天点击过的单词有<span>{Object.keys(todayWords).length}</span>个:</p>
                    <div>{todayWords && Object.keys(todayWords).join(", ")}</div>
                </div>
                <div className="valid-words-info">
                    <p>今天的有效单词(单词卡片停留时间大于40秒)有<span>{validWords.length}</span>个:</p>
                    <div>{todayWords && validWords.join(", ")}</div>
                </div>
            </Modal>
        </div>
    );
  }
}
