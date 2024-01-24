import _ from 'lodash';
import {list1, list2, list3, list4, list5, list6, list7, list8, list9, list10, list11, list12, list13, list14, list15} from './wordlist-es';
import {letterList} from './config';

// 获取所有单词的字典例句
export const getDicExamples = () => {
    let k = 0;
    const list = list1.concat(
        list2, 
        list3, 
        list4, 
        list5, 
        list6, 
        list7, 
        list8, 
        list9, 
        list10, 
        list11, 
        list12, 
        list13, 
        list14, 
        list15
        ).sort();
    const uniqueArr = Array.from(new Set(list));
    const obj = {};
    for (let i = 0; i < uniqueArr.length; i++) {
        const word = uniqueArr[i];
        // 加载sense1基本信息
        import(`./wordlist/${word}/list/sense1/senseCommon.js`).then(res => {
            const senseExamples = res.default?.wordExamples?.map((item, itemIndex) => {
                obj[`${word}_sense_1_example_${itemIndex}`] = item;
            });
            k++;
        }).catch(err => {});
    }
    setInterval(() => {
        if (k === uniqueArr.length) {
            console.log(JSON.stringify(obj));
        }
    }, 30000)
}

export const getFirstWord = () => {
    const firstWords = [];
    const wordList = list1.concat(list2, list3, list4, list5, list6, list7, list8, list9, list10, list11, list12, list13, list14, list15).sort();
    for (let i = 0; i < letterList.length; i++) {
        const wordIndex = _.findIndex(wordList, item => {
            return _.startsWith(item, letterList[i].toLocaleLowerCase());
        });
        if (wordIndex > -1) {
            firstWords.push({
                letter: letterList[i],
                word: wordList[wordIndex]
            });
        }
    }
    return firstWords;
};

export const getDayKey = (str = 'today') => {
    let d = new Date();
    if (str === 'yesterday') {
        d = new Date(new Date().getTime() - 1000 * 60 * 60 * 24);
    }
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const date = d.getDate();
    return `words${year}${month}${date}`;
};
