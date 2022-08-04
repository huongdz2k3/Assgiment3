import { Injectable } from '@nestjs/common';

import { Workbook } from 'exceljs';
import { resolve } from 'path';
// import * as tmp from '/'
import { AuthService } from './Auth/auth.service';
import { TodoService } from './Todo/todo.service';
@Injectable()
export class AppService {
  constructor(private authService: AuthService, private todoService: TodoService) { }
  private styleSheet(sheet, rows) {
    // set the width of each column

    for (let i = 1; i < rows.length; i++) {
      const color = rows[i][2]
      sheet.getCell(`B${i + 1}`).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: color }

      };
    }
    // set the height of header
    sheet.getRow(1).height = 30.5


    // font color 
    sheet.getRow(1).font = { size: 11.5, bold: true, color: { argb: 'FFFFFF' } }
    // background color 
    sheet.getRow(1).fill = { type: 'pattern', pattern: "solid", bgColor: { argb: 'ffd966' }, fgColor: { argb: 'ffd966' } }
    // alignments
    sheet.getRow(1).alignment = { vertical: "middle", horizontal: "center", wrapText: true }
    // borders
    sheet.getRow(1).border = {
      top: { style: 'thin', color: { argb: 'ffd966' } },
      left: { style: 'thin', color: { argb: 'FFFFFF' } },
      bottom: { style: 'thin', color: { argb: 'ffd966' } },
      right: { style: 'thin', color: { argb: 'FFFFFF' } }
    }
  }
  async exportExcel(username: string) {
    const list = (await this.authService.getUser(username)).lists
    let rows = []
    list.forEach(doc => {
      let arr = []
      arr.push(doc.description)
      arr.push(doc.duedate)
      arr.push(doc.colorcode)
      rows.push(arr)
    })

    let book = new Workbook()
    let sheet = book.addWorksheet('sheet')
    const sheet_name = ['Description', 'Due Date']
    rows.unshift(sheet_name) // add name sheet
    sheet.addRows(rows) // add rows to row
    this.styleSheet(sheet, rows)
    await book.xlsx.writeFile('./src/Excel/TodoListExport.xlsx').then(_ => {
      resolve('./src/Excel/TodoListExport.xlsx')
    })
    return {
      status: 'success'
    }
  }

  async importExcel(username: string) {
    let book = new Workbook()
    const lists = (await this.authService.getUser(username)).lists
    let data = []
    await book.xlsx.readFile('./src/Excel/TodoListExport.xlsx').then(() => {
      let sheet = book.getWorksheet('sheet')
      for (let i = lists.length + 1; i <= sheet.actualRowCount; i++) {
        let task = {
          description: sheet.getRow(i).getCell(1).toString(),
          duedate: sheet.getRow(i).getCell(2).toString(),
          colorcode: sheet.getRow(i).getCell(3).toString()
        }
        data.push(task)
      }

    });

    const dataWait = []
    for (let i = 1; i < data.length; i++) {
      let task = data[i]
      dataWait.push(this.todoService.createTodo(task.description, task.duedate, task.colorcode, username))
    }
    await Promise.all(dataWait)

    return {
      status: 'success'
    }
  }
}
