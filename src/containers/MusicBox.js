import React from 'react';
import { connect } from 'react-redux';
import Tone from 'tone';
import styled from 'styled-components';

import { TOGGLE_KEY, START_GAME, STOP_GAME, STEP_GRID } from '../constants';

import { PERIOD_MS } from '../../config/main.config';

const Container = styled.div`
  height: 50%;
  padding-top: .5rem;

  .key-visualizer {
    display: flex;
    align-items: center;
    justify-content: space-around;
    border: .2rem solid #111111;
    width: 6rem;
    height 2rem;
    background: white;
    &:hover {
      cursor: pointer;
      background: #111111;
      .bouncey-ball { background: #F4F4F4; }
    }
  }

  .bouncey-ball {
    height: 10px;
    width: 10px;
    border-radius: 100%;
    background: #111111;
    &.bouncing {
      &.major { animation: bounce .5s ease-in-out infinite, major-phase .5s ease-in-out infinite; }
      &.minor { animation: bounce .5s ease-in-out infinite, minor-phase .5s ease-in-out infinite; }
    }

    &.bouncing:nth-child(1) { animation-delay: .1s; }
    &.bouncing:nth-child(2) { animation-delay: .2s; }
    &.bouncing:nth-child(3) { animation-delay: .3s; }
    &.bouncing:nth-child(4) { animation-delay: .4s; }
    &.bouncing:nth-child(5) { animation-delay: .5s; }
  }

  @keyframes bounce {
    25% { transform: translateY(5px); }
    75% { transform: translateY(-5px); }
  }

  @keyframes major-phase {
    0% { background: #FF0000; }
    50% { background: #FF7F00; }
    75% { background: #FFFF00; }
    100% { background: #FF0000; }
  }

  @keyframes minor-phase {
    0% { background: #0000FF; }
    50% { background: #4B0082; }
    75% { background: #9400D3; }
    100% { background: #0000FF; }
  }
`;

const synth = new Tone.PolySynth(16, Tone.Synth);
const volume = new Tone.Volume(-24);
synth.chain(volume, Tone.Master);

const MusicBox = ({ notesToPlay, toggleKey, playing, start, stop, isMajorKey }) => {
  synth.triggerAttackRelease(notesToPlay, .2);
  return (
    <Container>
      <div className="fl w-50">
        <div className="key-visualizer" onClick={toggleKey}>
          <div className={`bouncey-ball ${playing ? 'bouncing' : ''} ${isMajorKey ? 'major' : 'minor'}`}></div>
          <div className={`bouncey-ball ${playing ? 'bouncing' : ''} ${isMajorKey ? 'major' : 'minor'}`}></div>
          <div className={`bouncey-ball ${playing ? 'bouncing' : ''} ${isMajorKey ? 'major' : 'minor'}`}></div>
          <div className={`bouncey-ball ${playing ? 'bouncing' : ''} ${isMajorKey ? 'major' : 'minor'}`}></div>
          <div className={`bouncey-ball ${playing ? 'bouncing' : ''} ${isMajorKey ? 'major' : 'minor'}`}></div>
        </div>
      </div>
      <div className="fl w-50">
        <i className={`fas ${playing ? 'fa-pause' : 'fa-play'} fr pointer`} onClick={playing ? stop : start}></i>
      </div>
    </Container>
  );
};

const mapStateToProps = (state) => ({
  notesToPlay: state.musicBox.currentNotes,
  keys: state.musicBox.keys,
  playing: Boolean(state.interval),
  isMajorKey: state.musicBox.currentKey === 0,
});

const mapDispatchToProps = dispatch => ({
  toggleKey: index => dispatch({ type: TOGGLE_KEY, index }),
  start: () => dispatch({
    type: START_GAME,
    interval: setInterval(() => dispatch({ type: STEP_GRID }), PERIOD_MS),
  }),
  stop: () => dispatch({ type: STOP_GAME }),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MusicBox);
