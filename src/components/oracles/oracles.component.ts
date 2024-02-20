import { Component, OnInit } from '@angular/core';
import ORACLES_JSON from '../../static/oracles.json';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-oracles',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './oracles.component.html',
  styleUrl: './oracles.component.scss',
})
export class OraclesComponent implements OnInit {
  oraclesList!: any;

  constructor() {}

  ngOnInit(): void {
    this.oraclesList = ORACLES_JSON.oracles;
  }
}
