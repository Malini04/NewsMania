import React, { Component } from 'react'
import NewsItem from './NewsItem';
import Spinner from './Spinner';
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";

export class News extends Component {
  articles = []

  static defaultProps = {
    country: 'in',
    pageSize: 8,
    category: 'general',
  }

  static propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
  }

  capitalizeFirstLetter = (string) =>{
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  constructor(props) {
    super(props)
    
    this.state = {
      articles: this.articles,
      loading: true,
      page: 1,
      totalResults: 0
    };
    document.title = `${this.capitalizeFirstLetter(this.props.category)} - NewsMonkey`;
  };
  
  async updateNews()
  {
      const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=46355f02d04e4f778822e4e7829d1b66&page=${this.state.page}&pageSize=${this.props.pageSize}`;
      this.setState({loading: true});
      let data = await fetch(url); 
      let parseData = await data.json()
      
      this.setState({articles: parseData.articles, totalResults: parseData.totalResults, loading: false})
  }  

  async componentDidMount(){
      this.updateNews()
    }

  //  handlePrevious = async ()=>{
  //   //console.log("Previous");
  //   //let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=6483299ac99a411e80cb45c48a61e2a9&page=${this.state.page - 1}&pageSize=${this.props.pageSize}`;
  //   //this.setState({loading: true});
  //   //let data = await fetch(url); 
  //   //let parseData = await data.json()
  //   //console.log(parseData);
    
  //   //this.setState({
  //     //page: this.state.page - 1,
  //     //articles: parseData.articles,
  //    // loading: false
  //   //})
  //   this.setState({page: this.state.page - 1 });
  //   this.updateNews();
  // }
  

  // handleNext = async ()=> {
  //   //console.log("Next");
  //   //if(!(this.state.page+1 > Math.ceil(this.state.totalResults/this.props.pageSize)) ){
  //   //let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=6483299ac99a411e80cb45c48a61e2a9&page=${this.state.page + 1}&pageSize=${this.props.pageSize}`;
  //   //this.setState({loading: true});
  //   //let data = await fetch(url); 
  //   //let parseData = await data.json()
    
  //   //this.setState({
  //     //page: this.state.page + 1,
  //     //articles: parseData.articles,
  //     //loading: false
  //   //})
  //   this.setState({page: this.state.page + 1 });
  //   this.updateNews();
  //   }
  fetchMoreData = async() => {

    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=6483299ac99a411e80cb45c48a61e2a9&page=${this.state.page+1}&pageSize=${this.props.pageSize}`;
    this.setState({page: this.state.page +1});
    let data = await fetch(url); 
    let parseData = await data.json();
    
    this.setState({articles: this.state.articles.concat(parseData.articles), totalResults: parseData.totalResults, loading: false})
  };
    
  render() {
    return (
      <>
        <h1 className="text-center" style = {{margin: '35px 0px', marginTop: '85px'}}>NewsMonkey - Top {this.capitalizeFirstLetter(this.props.category)} Headlines </h1>
        {this.state.loading && <Spinner/>}
        <InfiniteScroll
          dataLength={this.state.articles.length}
          next={this.fetchMoreData}
          hasMore={this.state.articles.length !== this.state.totalResults}
          loader={<Spinner/>}
        >
        <div className="container">
        <div className="row">
          { this.state.articles.map((element) => {
            return <div className="col-md-4" key={element.url}>
                <NewsItem  title={element.title?element.title.slice(0, 45):""} description={element.description} imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name} />
              </div>
            
          })}
        </div>
        </div>

        </InfiniteScroll>
        {/* <div className="container d-flex justify-content-between">
        <button disabled={this.state.page<=1} type="button" className="btn btn-outline-dark" onClick={this.handlePrevious}>&larr; Previous</button>
        <button disabled={this.state.page+1 > Math.ceil(this.state.totalResults/this.props.pageSize)} type="button" className="btn btn-outline-dark" onClick={this.handleNext}>Next &rarr;</button>
        </div> */}
      </>

    )
  }
}

export default News