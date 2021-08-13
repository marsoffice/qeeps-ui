import { Component, OnInit } from '@angular/core';
import {MatTreeNestedDataSource} from '@angular/material/tree';
import {NestedTreeControl} from '@angular/cdk/tree';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';


interface FoodNode {
  name: string;
  children?: FoodNode[];
}

const TREE_DATA: FoodNode[] = [
  {
    name: 'Organizatie',
    children: [
      {name: 'Organizatie1'},
      {name: 'Organizatie2'},
      {name: 'Organizatie3'},
    ]
  }, {
    name: 'Rol',
    children: [
      {
        name: 'Administrator',
        children: [
          {name: 'Admin1'},
          {name: 'Admin2'},
        ]
      }, {
        name: 'Secretara',
        children: [
          {name: 'Secretara 1'},
          {name: 'Secretara 2'},
        ]
      },
    ]
  },
];

@Component({
  selector: 'app-forms-add',
  templateUrl: './forms-add.component.html',
  styleUrls: ['./forms-add.component.scss']
})
export class FormsAddComponent implements OnInit {
  treeControl = new NestedTreeControl<FoodNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<FoodNode>();

  columns: any = []

  rows: any = []


  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.columns, event.previousIndex, event.currentIndex);
  }

  constructor() { }

  ngOnInit(): void {
    this.dataSource.data = TREE_DATA;
  }
  hasChild = (_: number, node: FoodNode) => !!node.children && node.children.length > 0;

  clickArrow(){
    this.columns.push({name: '', type: 'text'});
  }

  clickArrow2() {
    this.rows.push({
      name: ''
    })
  }

}
