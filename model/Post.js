import {field, text} from '@nozbe/watermelondb/decorators';
import {Model} from '@nozbe/watermelondb';

export default class Post extends Model {
  static table = 'posts';

  @text('title') title;
  @text('body') body;
  @text('subtitle') subtitle;
  @field('is_pinned') isPinned;
}
