import {
  AfterViewInit,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  inject,
  OnInit,
  signal,
  ViewChild
} from '@angular/core';
import {DashboardService} from '../dashboard-service';
import {SlideService} from '../slide-service';
import {SlideDto} from '../slide-dto';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Home implements OnInit, AfterViewInit {

  private dashboardService = inject(DashboardService);
  private slideService = new SlideService();

  message = signal('');

  slides = signal<SlideDto[]>([]);

  @ViewChild('swiper') swiper!: ElementRef;

  ngAfterViewInit() {
    console.log('swiper init', this.swiper.nativeElement);

    Object.assign(this.swiper.nativeElement, {
      navigation: true,
      pagination: true,
      autoplay: {
        delay: 5000
      }
    });

    this.swiper.nativeElement.initialize();
    console.log(this.swiper.nativeElement.swiper);
  }

  ngOnInit(): void {
    this.dashboardService.welcome()
      .subscribe(dto => this.message.set(dto.message));
    this.slideService.getAllVisible().subscribe((result) => this.slides.set(result));
  }
}
