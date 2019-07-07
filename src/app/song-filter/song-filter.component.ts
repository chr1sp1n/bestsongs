import { Component, OnInit } from '@angular/core';
import { BestSong } from '../_models/best-song';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BestSongsService } from '../_services/best-songs/best-songs.service';
import { Tag } from '../_models/tag';


@Component({
	selector: 'app-song-filter',
	templateUrl: './song-filter.component.html',
	styleUrls: ['./song-filter.component.scss']
})



export class SongFilterComponent implements OnInit {

	allTags: Tag = new Tag('All');
	filterText: string = '';

	constructor(
		public activeModal: NgbActiveModal,
		private modalService: NgbModal,
		private bestSongsService: BestSongsService,
	) {
		this.filterText = this.bestSongsService.filterText;
	}

	ngOnInit() {
		if(this.bestSongsService.tags.length > 0) return;
		let tags: string[] = [];
		this.bestSongsService.songs.forEach( (s: BestSong, i:number) => {
			s.songTags().forEach( (t:string) => {
				if(tags.indexOf(t) == -1) {
					tags.push(t);
					this.bestSongsService.tags.push( new Tag(t) );
				}
			});
		});
	}

	tags(){
		return this.bestSongsService.tags;
	}

	logic(state?: boolean){
		if(typeof state != 'undefined') {
			this.bestSongsService.filterLogic = state;
			//this.filter();
		}
		return this.bestSongsService.filterLogic;
	}

	setAllTag(){
		this.allTags.state = !this.allTags.state;
		this.bestSongsService.tags.forEach( (t: Tag, i:number ) => {
			this.bestSongsService.tags[i].state = this.allTags.state;
		});
		//this.filter();
	}

	filter(){

		let tags = this.bestSongsService.tags.filter( t => { return t.state });

		if(this.filterText.trim().toString() != this.bestSongsService.filterText){
			this.bestSongsService.filterText = this.filterText.trim().toString();
		}

		this.bestSongsService.songs.forEach( (s: BestSong, i:number) => {
			this.bestSongsService.songs[i].visible = true;
			if(tags.length > 0){
				if(!this.bestSongsService.filterLogic){
					this.bestSongsService.songs[i].visible = false;
					tags.forEach( (t:Tag) => {
						if( s.songsHasTag(t.label) ) {
							this.bestSongsService.songs[i].visible = true;
						}
					});
				}else{
					this.bestSongsService.songs[i].visible = true;
					tags.forEach( (t:Tag) => {
						if( !s.songsHasTag(t.label) ) {
							this.bestSongsService.songs[i].visible = false;
						}
					});
				}
			}


			if( this.bestSongsService.filterText != '' &&
				this.bestSongsService.songs[i].title.indexOf( this.bestSongsService.filterText ) == -1
			){
				this.bestSongsService.songs[i].visible = false;
			}

		});

		this.activeModal.close();
	}

	reset(){
		this.bestSongsService.songs.forEach( (s: BestSong, i:number) => {
			this.bestSongsService.songs[i].visible = true;
		});
		this.bestSongsService.tags.forEach ( (t: Tag, i: number ) => {
			this.bestSongsService.tags[i].state = false;
		});
		this.bestSongsService.filterText = null;
		this.filterText = this.bestSongsService.filterText;
		this.logic(false);
	}

}
