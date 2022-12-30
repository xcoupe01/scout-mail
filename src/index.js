import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { MemberList } from './member-tab.js';

// column numbers in the xlsx file - count from 1
const NAME = 1;            // member name
const CATHEGORY = 2;       // member cathegory
const MAIN_MAIL = 3;       // main email
const FATHER_MAIL = 4;     // father email
const MOTHER_MAIL = 5;     // mother email

/**
 * Main react component of the project
 */
class App extends React.Component {
  members = [];

  /**
   * Parses input xlsx file and creates inner representation
   * of the contacts like so:
   *  - each contact is an object containing thees:
   *    - name - the name of the member.
   *    - cathegory - the cathegory of the member.
   *    - mail - an array of three emails (main, father, mother).
   *    - actives - an array of bools corresponding to the mails.
   *        when true, corresponding mail is active, otherwise when false.
   */
  read() {
    const Excel = require('exceljs');
    const wb = new Excel.Workbook();
    const reader = new FileReader();
    const file = document.getElementById('xlsx-file').files[0];
  
    reader.readAsArrayBuffer(file)
    reader.onload = () => {
      const buffer = reader.result;
      wb.xlsx.load(buffer).then(workbook => {
        workbook.eachSheet((sheet, id) => {
          sheet.eachRow((row, rowIndex) => {
            if(rowIndex > 7){
              this.members.push({
                name: row.values[NAME], 
                cathegory: row.values[CATHEGORY],
                mail: [row.values[MAIN_MAIL], row.values[FATHER_MAIL], row.values[MOTHER_MAIL]],
                actives: [false, false, false],
              });
            }
          })
        })
        this.setState({members: this.members});
      })
    }
  };

  /**
   * Sets any contact to active
   * @param {int} row is the row of the contact
   * @param {int} col is the collumn of the contact
   */
  setActive(row, col){
    this.members[row].actives[col] = this.members[row].actives[col] ? false : true;
    this.setState({members: this.members}); 
  }

  /**
   * Select or unselect all contacts in a given row
   * @param {int} row is the row to be selected
   */
  setAllAct(row){
    if(this.members[row].actives.every(element => element === false)){
      this.members[row].actives = [true, true, true];
    } else {
      this.members[row].actives = [false, false, false];
    }
    this.setState({members: this.members}); 
  }

  /**
   * Sorts the array of contacts ba a given parameter:
   *  - 'name-up' - sorts the array by name in alphabetical order
   *  - 'cathegory' - sorts the array by cathegory in alphabetical order
   * @param {string} by the sorting parameter
   */
  sort(by){
    this.members.sort((a, b) => {
      let dataA;
      let dataB;
      if(by === 'name-up'){
        dataA = a.name.toUpperCase();
        dataB = b.name.toUpperCase();
      } else {
        dataA = a.cathegory.toUpperCase();
        dataB = b.cathegory.toUpperCase();
      }
      if (dataA < dataB) {
        return -1;
      }
      if (dataA > dataB) {
        return 1;
      }
      return 1;
    });
    this.setState({members: this.members});
  }

  /**
   * Copies selected emails to the clipboard
   */
  getSelected(){
    let mails = [];
    let result = "";
    this.members.forEach((item) => {
      for(let i = 0; i < 3; i++){
        if(item.actives[i] && !mails.includes(item.mail[i])){
          mails.push(item.mail[i])
        }
      }
    })
    mails.forEach((item) => {
      result += item + " ";
    })
    navigator.clipboard.writeText(result);
  }

  clearTable(){
    this.members = [];
    this.setState({members: this.members});
  }

  /**
   * react render function
   */
  render(){
    return (
      <div>
        <div className='headline'>
          <input 
            className='button'
            type='button'
            onClick={() => {this.clearTable()}}
            value='Vymaž tabulku'
          >
          </input> 
          <div>
            <label htmlFor="xlsx-file">Vyber soubor xlsx</label>
            <input 
              className='inputfile'
              type='file' 
              id='xlsx-file' 
              accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" 
              onChange={() => {this.read()}}>
            </input>
          </div>
          <input 
            className='button'
            type='button'
            onClick={() => {this.getSelected()}}
            value='Kopíruj do clipboardu'
          >
          </input>
        </div>
          <MemberList 
            members={this.members}
            setAct={(row, col) => {this.setActive(row, col)}}
            setAllAct={(row) => {this.setAllAct(row)}}
            sort={(by) => {this.sort(by)}}
            ></MemberList>
      </div>
    )
  }
}

// the render start of the app
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);