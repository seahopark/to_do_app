import React from 'react';
import { StyleSheet, FlatList, SafeAreaView, AsyncStorage  } from 'react-native';
import Header from './component/Header'
import TodoItem from './component/TodoItem'
import TaskModal from './component/TaskModal'

export default class App extends React.Component {
  state = {
    todos: [{
        title: '진행중인 Task를 완료 후 체크하세요.',
        done: false,
    }, {
        title: '다시 진행할 Task는 언체크 하세요.', 
        done: true,
    }, {
      title: '오른쪽에서 왼쪽으로 swipe를 하면 삭제버튼이 나옵니다.', 
      done: true,
  }],
    showModal: false,
  }
  componentWillMount() {
    AsyncStorage.getItem('@todo:state').then((state) =>{
      this.setState(JSON.parse(state))
    })
  }
  save =() => {
    AsyncStorage.setItem('@todo:state', JSON.stringify(this.state))
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Header
          show={() => {
            this.setState({ showModal:true})
          }}
        />
        <FlatList
          data={this.state.todos}
          renderItem={({item, index }) => {
            return (
              <TodoItem
                title={item.title}
                done={item.done }
                remove={() => {
                  this.setState({
                    todos: this.state.todos.filter((_, i) => i !== index),
                  },this.save)
                }}
                toggle={() => {
                  const newTodos = [...this.state.todos]
                  newTodos[index]. done = !newTodos[index].done
                  this.setState({todos: newTodos}, this.save)
                }}
              />
            )
          }}
          keyExtractor={(_, index) => `${index}`}
        />
        <TaskModal isVisible= {this.state.showModal}
          add ={(title) => {
            this.setState({ 
              todos: this.state.todos.concat({
                title: title,
                 done: false,
              }),
              showModal: false,
            },this.save)
          }}
          hide ={() =>{
            this.setState({ showModal: false})
          }}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
