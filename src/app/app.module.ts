import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { MaterialModule } from '@angular/material';
import { Ng2PaginationModule } from 'ng2-pagination';
import { UserServiceService } from './user-service.service';
import { RouterModule } from '@angular/router';
import { ThreadViewComponent } from './thread-view/thread-view.component';
import { HomeViewComponent } from './home-view/home-view.component';
import { TrustAllHTMLPipe } from './trust-all-html.pipe';
import { HighlightJsModule, HighlightJsService } from '../../node_modules/angular2-highlight-js/lib/highlight-js.module';
import { CategoryViewComponent } from './category-view/category-view.component';
import { TagViewComponent } from './tag-view/tag-view.component';
import { YoutubePlayerModule } from 'ng2-youtube-player';

@NgModule({
  declarations: [
    AppComponent,
    ThreadViewComponent,
    HomeViewComponent,
    TrustAllHTMLPipe,
    CategoryViewComponent,
    TagViewComponent
  ],
  imports: [
    BrowserModule,
    MaterialModule.forRoot(),
    Ng2PaginationModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot([
      { path: 'bai-viet/:string/:id', component: ThreadViewComponent },
      { path: 'danh-muc/:string/:id', component: CategoryViewComponent },
      { path: 'tag/:string', component: TagViewComponent },
      { path: '', component: HomeViewComponent },//home
      { path: '**', component: AppComponent }//notfound
    ]),
    HighlightJsModule,
    YoutubePlayerModule
  ],
  providers: [
    UserServiceService,
    HighlightJsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
