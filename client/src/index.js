var React = require('react');

//superagent is a query libary that lets us make HTTP requests from the browser
var request = require('superagent');
var slug = require('slug');

//a module to access the data using superagent
var data = {
  //sends HTTP GET request to server for bookmark list
  getBookmarks: function(callback){
    request
      //get bookmarks
      .get('/api/bookmarks')
      //only send us data in JSON format
      .set('Accept', 'application/json')
      //callback function when request is done
      .end(function(err, res) {
        callback(err, res.body);
      });
  },

  //sends HTTP POST request with bookmark info. pass the bookmark as a parameter
  createBookmark: function(bookmark) {
    request 
      //make a POST request
      .post('/api/bookmarks')
      //sending new bookmark info
      .send(bookmark)
      //callback func when done
      .end(function(err, res){
        callback(err, res.body);
      });
  },

  //sends a DELETE request
  deleteBookmark: function(bookmark, callback){
    request
      //here's where we use the slug library
      .del( '/api/bookmarks/' + slug(bookmark.link) )
      //callback func when done
      .end(callback);
  }
}

//the react core app. This is kind of like react's "init"
var App = React.createClass({
  render: function() {
    var bookmark = this.props.bookmarks[0];
    var bookmark2 = this.props.bookmarks[1];
    return (
      <div>
        <h1>Hello React - bookmarks app</h1>
        <BookmarkList bookmarks={this.props.bookmarks}>
        </BookmarkList>
      </div>
    )
  }
});


//define our array of bookmarks
bookmarks = [
  {title: "title 01", link: "http://bookmark.com/"},
  {title: "title 02", link: "http://bookmark2.com/"}
];

//the bookmark class. has a method for deletion
var Bookmark = React.createClass({
  onDeleteClicked: function(){
    bookmark = this.props;
    this.props.removeLine(bookmark);
  },

  render: function() {
    return (
      <div>
        <p class="title">{this.props.title}</p>
        <p class="link"><a href="{this.props.link}">{this.props.link}</a></p>
        <p><button onClick={this.onDeleteClicked}>DELETE</button></p>
      </div>
    ); 
  }
});

/*the BookmarkList class. this holds the "state" of the app
  has multiple methods:
  - getInitialState: what the name says
  - onAddClicked: gets values from inputs and creates a new bookmark
  - removeLine:  remove a Bookmark from the BookmarkList
*/
var BookmarkList  = React.createClass({
  getInitialState: function() {
    return {bookmarks: this.props.bookmarks}
  },

  onAddClicked: function() {
    var bookmarks = this.state.bookmarks;
    var title = this.refs.titleInput.getDOMNode().value;
    var link = this.refs.linkInput.getDOMNode().value;

    var bookmark = {title: title, link:link};
    bookmarks.push(bookmark);

    //here we modify the state
    this.setState({bookmarks: bookmarks});

    //here we save the change to the server
    data.crateBookmark(bookmark, function(){});
  },

  removeLine: function(line) {
    var bookmarks = this.state.bookmarks;
    var index = 0;
    while (index < bookmarks.length && bookmarks[index].link !== line.link) {
      index++;
    }
    if (index < bookmarks.length) {
      var bookmark = bookmarks.splice(index, 1)[0];

      //here we modify the state
      this.setState({bookmarks: bookmarks});

      //here we save the change to the server
      data.deleteBookmark(bookmark, function(){});
    }
  },

  render: function() {
    var removeLine = this.removeLine;

    var bookmarks = this.state.bookmarks.map(function(bookmark) {
      return (
        <Bookmark title={bookmark.title} link={bookmark.link} removeLine={removeLine}>
        </Bookmark>
      );
    });

    return (
      <div>
        <div>
          <label>title</label>
          <input ref="titleInput" type="text" ></input>
        </div>
        <div>
          <label>url</label>
          <input ref="linkInput" type="text"></input>
        </div>
        <div>
          <button onClick={this.onAddClicked}>+</button>
        </div>
        <div>
          {bookmarks}
        </div>
      </div>
    );

  }//end render 

});

//before rending the list we grab the data from the server
data.getBookmarks(function(err, bookmarks){
  //render the list
  React.render(<App bookmarks={bookmarks}></App>, document.getElementById('app'));
});


