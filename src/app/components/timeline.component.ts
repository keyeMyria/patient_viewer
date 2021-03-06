import {Component, Input} from '@angular/core';

import {NgGrid, NgGridItem, NgGridConfig, NgGridItemConfig, NgGridItemEvent} from 'angular2-grid';

import {DraggableWidget} from './draggable_widget.component';

import {FhirService} from '../services/fhir.service';
import {TimelineService} from '../services/timeline.service';
import {DoctorService} from '../services/doctor.service';
import {Timeline} from '../models/timeline.model';
import {Patient} from '../models/patient.model';

@Component({
    selector: 'timelines',
    templateUrl: '/timeline.html'
})
export class TimelineComponent implements DraggableWidget {

    selected: Timeline;
    timeline: Array<Timeline> = [];
    @Input() patient: Patient;

	// For options: https://github.com/BTMorton/angular2-grid
	gridItemConfiguration: NgGridItemConfig = {
		'col': 35,               //  The start column for the item
		'row': 2,               //  The start row for the item
		'sizex': 70,             //  The start width in terms of columns for the item
		'sizey': 10,             //  The start height in terms of rows for the item
		'dragHandle': null,     //  The selector to be used for the drag handle. If null, uses the whole item
		'resizeHandle': null,   //  The selector to be used for the resize handle. If null, uses 'borderSize' pixels from the right for horizontal resize,
		//    'borderSize' pixels from the bottom for vertical, and the square in the corner bottom-right for both
		'borderSize': 15,
		'fixed': false,         //  If the grid item should be cascaded or not. If yes, manual movement is required
		'draggable': true,      //  If the grid item can be dragged. If this or the global setting is set to false, the item cannot be dragged.
		'resizable': true,      //  If the grid item can be resized. If this or the global setting is set to false, the item cannot be resized.
		'payload': null,        //  An optional custom payload (string/number/object) to be used to identify the item for serialization
		'maxCols': 0,           //  The maximum number of columns for a particular item. This value will only override the value from the grid (if set) if it is smaller
		'minCols': 0,           //  The minimum number of columns for a particular item. This value will only override the value from the grid if larger
		'maxRows': 0,           //  The maximum number of rows for a particular item. This value will only override the value from the grid (if set) if it is smaller
		'minRows': 0,           //  The minimum number of rows for a particular item. This value will only override the value from the grid if larger
		'minWidth': 0,          //  The minimum width of a particular item. This value will override the value from the grid, as well as the minimum columns if the resulting size is larger
		'minHeight': 0,         //  The minimum height of a particular item. This value will override the value from the grid, as well as the minimum rows if the resulting size is larger
	}

    constructor(private fhirService: FhirService, private timelineService: TimelineService, private doctorService: DoctorService) {
        console.log("TimelineService created...");
		this.gridItemConfiguration.draggable = this.doctorService.configMode;
    }

    ngOnChanges() {
        if (this.patient) {
            this.timelineService.index(this.patient).subscribe(data => {
				if (data.entry) {
                    this.timeline = <Array<Timeline>>data.entry.map(r => r['resource']);
                    this.timeline = this.timeline.reverse();
					console.log("Loaded " + this.timeline.length + " timelines.");
				} else {
					this.timeline = new Array<Timeline>();
					console.log("No timelines for patient.");
				}
            });
        }
    }
}
