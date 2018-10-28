//  This file is part of Emolingo Emotion Synonym Match Game Web App.
//  https://github.com/Emolingo/emolingo-emotion-synonym-match-game-web-app

import React from 'react';
import arrTermCategories from './terms_categories.js';


const TIMEOUT_FLASH = 250;
const TOTAL_FLASHES_ON_ERROR = 4;
const TOTAL_FLASHES_ON_SOLVED = 9;
const TOTAL_PAIRS_PER_ROUND = 3;


const pickPair = () => {
    const indexTermCategory = Math.floor(Math.random() * arrTermCategories.length);
    const objTermCategory = arrTermCategories[indexTermCategory];
    const indexSec = Math.floor(Math.random() * objTermCategory.sec.length);
    return {
      pri: objTermCategory.pri,
      sec: objTermCategory.sec[indexSec]
    }
};

const pickPairs = () => {
    const arrPairs = [],
          mapPri = {};
    for (let i = 0; i < TOTAL_PAIRS_PER_ROUND; i++) {
        const objPair = pickPair();
        if (mapPri[objPair.pri]) {
            //  This terms category has already been randomly picked before.
            //  Need to try again.
            i--;
            continue;
        }
        mapPri[objPair.pri] = true;
        objPair.index = i;
        arrPairs.push(objPair);
    }
    return arrPairs;
};

const extractTerms = arrPairs => {
    const arrTerms = [];
    for (let i = 0; i < arrPairs.length; i++) {
        const objPair = arrPairs[i];
        arrTerms.push({
            term: objPair.pri,
            pair: objPair
        });
        arrTerms.push({
            term: objPair.sec,
            pair: objPair
        });
    }
    return arrTerms;
};

/**
 * Shuffles array in place. ES6 version
 * @param {Array} a items An array containing the items.
 *
 *  From: https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
 */
const shuffle = a => {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
};

const prepareNewTerms = () => shuffle(extractTerms(pickPairs()));

class TermWidget extends React.Component {
    render() {
        return (<div style={{
                background: this.props.isError
                                ? (this.props.isOddErrorTick ? null : 'red')
                                : (this.props.isSelected
                                    ? 'yellow'
                                    : this.props.isSolved
                                        ? (this.props.isOddSolvedTick
                                              ? null
                                              : 'green')
                                        : null),
                color: this.props.isSolved ? 'white' : null,
                cursor: this.props.isReadOnly || this.props.isSolved
                                ? null
                                : 'pointer',
                margin: '1em',
                border: '1px solid black',
                padding: '1em'
            }} onClick={ () => {
                    if (this.props.isReadOnly || this.props.isSolved) {
                        return;
                    }
                    this.props.onSelect();
                }
            }>
              { this.props.objTerm.term }
            </div>);
    }
}

class GameBoard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            terms: prepareNewTerms()
        };
    }

    render() {
        return (
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {
                  this.state.terms.map((objTerm, index) =>
                      <TermWidget key={ index }
                          isError={
                              this.state.errors &&
                              this.state.errors[index]
                          }
                          isOddErrorTick={ this.state.isOddErrorTick }
                          isOddSolvedTick={ this.state.isOddSolvedTick }
                          isReadOnly={ this.state.isReadOnly }
                          isSelected={
                              this.state.indexSelected === index
                          }
                          isSolved={
                              this.state.solved &&
                              this.state.solved[index]
                          }
                          onSelect={ () => {
                              if (this.state.indexSelected == null) {
                                  //  The user just selected their first term.
                                  this.setState({
                                      ...this.state,
                                      indexSelected: index
                                  });
                              } else {
                                  if (this.state.terms[this.state.indexSelected].pair === objTerm.pair) {
                                      //  The user has picked 2 matching terms.
                                      const solved = {
                                          ...this.state.solved
                                      };
                                      solved[this.state.indexSelected] = true;
                                      solved[index] = true;
                                      const totalSolved = (this.state.totalSolved || 0) + 2;
                                      this.setState({
                                          ...this.state,
                                          indexSelected: null,
                                          solved,
                                          totalSolved
                                      })
                                      if (totalSolved === this.state.terms.length) {
                                          this._flashSolved();
                                      }
                                  } else {
                                      //  The user has picked 2 non-matching terms.
                                      this._flashError(this.state.indexSelected, index);
                                  }
                              }
                          }}
                          objTerm={ objTerm } />)
              }
            </div>
        );
    }

    _flashError(index1, index2) {
        const errors = {};
        errors[index1] = true;
        errors[index2] = true;
        this.setState({
            ...this.state,
            errors,
            indexSelected: null,
            isReadOnly: true
        });

        let totalFlashesLeft = TOTAL_FLASHES_ON_ERROR;

        const _doTick = () => {
            setTimeout(() => {
                if (totalFlashesLeft === 0) {
                    this.setState({
                        ...this.state,
                        errors: null,
                        isOddErrorTick: null,
                        isReadOnly: false
                    });
                } else {
                    this.setState({
                        ...this.state,
                        isOddErrorTick: !this.state.isOddErrorTick
                    });
                    totalFlashesLeft--;
                    _doTick();
                }
            }, TIMEOUT_FLASH);
        };
        _doTick();
    }

    _flashSolved() {
        let totalFlashesLeft = TOTAL_FLASHES_ON_SOLVED;

        const _doTick = () => {
            setTimeout(() => {
                if (totalFlashesLeft === 0) {
                    this.setState({
                        ...this.state,
                        isOddSolvedTick: null,
                        solved: null,
                        totalSolved: 0,
                        terms: prepareNewTerms()
                    });
                } else {
                    this.setState({
                        ...this.state,
                        isOddSolvedTick: !this.state.isOddSolvedTick
                    });
                    totalFlashesLeft--;
                    _doTick();
                }
            }, TIMEOUT_FLASH);
        };
        _doTick();
    }
}

export default GameBoard;
