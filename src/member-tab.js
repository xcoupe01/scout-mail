import React from 'react';
import './index.css';

/**
 * Member tab react component to represent one row/member in the table
 */
class MemberTab extends React.Component{
  render(){
    return(
      <tr className='member' >
        <td onClick={() => {this.props.setAllAct()}} style={{cursor: 'pointer'}}>
          {this.props.member.name}
        </td>
        <td>
          {this.props.member.cathegory}
        </td>
        <td className={'email-active-'+this.props.member.actives[0]}  onClick={() => {
         this.props.setAct(0)
        }} style={{cursor: 'pointer'}}>
          {this.props.member.mail[0]}
        </td>
        <td className={'email-active-'+this.props.member.actives[1]}  onClick={() => {
          this.props.setAct(1)
        }} style={{cursor: 'pointer'}}>
          {this.props.member.mail[1]}
        </td>
        <td className={'email-active-'+this.props.member.actives[2]}  onClick={() => {
          this.props.setAct(2)
        }} style={{cursor: 'pointer'}}>
          {this.props.member.mail[2]}
        </td>
      </tr>
    )
  }
}

/**
 * react component to represent the whole memeber list
 */
class MemberList extends React.Component{
  render(){
    return(
      <div>
        <table>
          <tbody>
            <tr>
              <th onClick={() => {this.props.sort('name-up')}} style={{cursor: 'pointer'}}>Jméno</th>
              <th onClick={() => {this.props.sort('cathegory-up')}} style={{cursor: 'pointer'}}>Družina</th>
              <th>Hlavní email</th>
              <th>Otec email</th>
              <th>Matka email</th>
            </tr>
            {
              Object.keys(this.props.members).map(function (key) {
                return <MemberTab 
                  key={key} 
                  member={this.props.members[key]} 
                  setAct={(col) => {this.props.setAct(key, col)}}
                  setAllAct={() => {this.props.setAllAct(key)}}/>
              }.bind(this))
            }
          </tbody>
        </table>
      </div>
    )
  }
}

export {MemberTab, MemberList};
