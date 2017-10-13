import React, { Component } from 'react';
import propTypes from 'prop-types';
import {  connect } from 'react-redux';
import { getABook, editBook } from '../actions/books';
import uploader from '../actions/upload';

let checker = true;
class updateBook extends Component {    
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        }
        this.coverChange = this.coverChange.bind(this);
        this.onChange = this.onChange.bind(this);
        this.pdfChange = this.pdfChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }
    componentWillReceiveProps(nextProps){
        if (nextProps.book && checker) {
            const { books } = nextProps.book
            this.setState({
                cover: books.cover,
                pdf: books.pdf,
                title: books.title,
                author: books.author,
                description: books.description,
                quantity: books.quantity,
                genre: books.genre,
                loading: false
            })
        }
        if (nextProps.pdf) {
            this.setState({
                pdf: nextProps.pdf,
                loading: false
            })
        }
        if (nextProps.cover) {
            this.setState({
                cover: nextProps.cover,
                loading: false
            })
        }
    }
    coverChange(e) {
        checker=false
        let cover = e.target.files[0];
        this.props.uploader(cover, 'cover')
        this.setState({
            loading: true
        })
    }
        onChange(e) {
        checker=false
        e.preventDefault()
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    pdfChange(e) {
        checker=false
        e.preventDefault()
        let pdf = e.target.files[0];
        this.props.uploader(pdf, 'pdf')
        this.setState({
            loading: true
        })
    }
    onSubmit(e) {
        e.preventDefault()
        this.props.editBook(this.state, this.props.params.id)
        this.setState({
        loading: true
        })
    }
    componentWillMount(){
        this.props.getABook(this.props.params.id)
    }
  render() {
      const { books } = this.props.book
    return (
        <div className='mdl-grid'>
            <div className='contents'>
                {Object.keys(books).length > 0 && <div className="card-enlarge mdl-card mdl-shadow--3dp">
                    <form ref='bookForm' onSubmit={this.onSubmit}>
                        <div className='mdl-textfield mdl-js-textfield mdl-textfield--floating-label card-content'>
                            <input type='text' className='mdl-textfield__input' defaultValue={books.title} onChange={this.onChange}
                                name='title' id='title' required/>
                        </div>
                        <div className='mdl-textfield mdl-js-textfield mdl-textfield--floating-label card-content'>
                            <input type='text' className='mdl-textfield__input'defaultValue={books.author} onChange={this.onChange}
                                name='author' id='author'required/>
                        </div>
                        <div className='mdl-textfield mdl-js-textfield mdl-textfield--floating-label card-content'>
                            <input type='text' className='mdl-textfield__input' defaultValue={books.description} onChange={this.onChange}
                                name='description' id='description'required/>
                        </div>
                        <div className='mdl-textfield mdl-js-textfield mdl-textfield--floating-label card-content'>
                            <input type='text' className='mdl-textfield__input' defaultValue={books.genre} onChange={this.onChange}
                                name='genre' id='genre'required/>
                        </div>
                        <div className='mdl-textfield mdl-js-textfield mdl-textfield--floating-label card-content'>
                            <input type='number' className='mdl-textfield__input' defaultValue={books.quantity} onChange={this.onChange}
                                name='quantity' id='text'required/>
                        </div>
                        <div className='card-content upload file-upload'>
                        <label htmlFor='file-upload' className='mdl-button mdl-js-button mdl-button--raised mdl-button--accent file-upload btn1'>Upload cover</label>
                            <input type='file' accept='image/*' className='mdl-textfield__input'defaultValue={books.cover} onChange={this.coverChange}
                                name='cover' id="file-upload"/>                 
                        <label htmlFor='file-upload2' className='mdl-button mdl-js-button mdl-button--raised mdl-button--accent file-upload btn2'>Upload Pdf</label>
                            <input type='file' className='mdl-textfield__input'defaultValue={books.pdf} onChange={this.pdfChange}
                                name='pdf' id="file-upload2"/>
                        </div>
                        <button disabled = {this.state.loading} className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored" id="button">
                            Update book
                        </button>
                    </form>                    
                </div>
                }
            </div>
        </div>
    );
  }
}

const mapStateToProps = (state) => {
    return {
        admin: state.createBook,
        book: state.getABook,
        cover: state.uploadCover.uploaded,
        pdf: state.uploadPdf.uploaded,
        updatedDetail: state.editBook.resp.updatedBook
    }
}

export default connect(mapStateToProps, { getABook, uploader, editBook })(updateBook);
