import { Database } from '@nozbe/watermelondb'
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite'
import migrations from '../model/migrations'
import Post from '../model/Post'
import { myschema } from '../model/schema'
import { Button, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'

myschema;

const adapter = new SQLiteAdapter({
  schema: myschema,
  migrations: migrations,
  onSetUpError: error => {
    console.log(error);
  }
})

const database = new Database({
  adapter,
  modelClasses: [Post],
})

export default function App() {

  const [AllPosts, SetAllPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [body, setBody] = useState("");
  const [selectedPostId, setSelectedPostId] = useState(null);

  useEffect(() => {
    GetPost();
  }, [])

  const GetPost = async () => {
    try {
      const PostData = await database.collections.get("posts").query().fetch();
      const temp = PostData.map(post => post._raw);
      SetAllPosts(temp);
    } catch (error) {
      console.log("Error fetching posts:", error);
    }
  }

  const AddPost = async () => {
    try {
      if (selectedPostId) {
        await database.write(async () => {
          const post = await database.get('posts').find(selectedPostId);
          await post.update(post => {
            post.title = title;
            post.subtitle = subtitle;
            post.body = body;
          });
          console.log("Post updated successfully:", post);
        });
        setSelectedPostId(null);
      } else {
        await database.write(async () => {
          const post = await database.get('posts').create(post => {
            post.title = title;
            post.subtitle = subtitle;
            post.body = body;
          });
          console.log("Post created successfully:", post);
        });
      }
      setTitle("");
      setSubtitle("");
      setBody("");
      GetPost();
    } catch (error) {
      console.log("Error adding/updating post:", error);
    }
  }

  const RemovePost = async (id) => {
    try {
      await database.write(async () => {
        const post = await database.get('posts').find(id);
        await post.markAsDeleted(); // soft delete
        await post.destroyPermanently(); // permanent delete
      });
      GetPost();
      console.log("Post removed successfully");
    } catch (error) {
      console.log("Error removing post:", error);
    }
  }

  const EditPost = (post) => {
    setTitle(post.title);
    setSubtitle(post.subtitle);
    setBody(post.body);
    setSelectedPostId(post.id);
  }

  return (
    <View style={styles.mainContainer}>
      <View style={styles.upperView}>
        <TextInput
          style={styles.TextInput}
          placeholder='Post Title'
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={styles.TextInput}
          placeholder='Post Subtitle'
          value={subtitle}
          onChangeText={setSubtitle}
        />
        <TextInput
          style={styles.TextInput}
          placeholder='Post Body'
          value={body}
          onChangeText={setBody}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={AddPost}>
        <Text style={styles.buttonText}>{selectedPostId ? "Update Post" : "Add Post"}</Text>
      </TouchableOpacity>

      <FlatList
        data={AllPosts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.postContainer}>
            <Text style={styles.postTitle}>{item.title}</Text>
            <Text style={styles.postSubtitle}>{item.subtitle}</Text>
            <Text style={styles.postBody}>{item.body}</Text>
            <View style={styles.actionsContainer}>
              <TouchableOpacity onPress={() => EditPost(item)} style={styles.editButton}>
                <Text style={styles.actionText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => RemovePost(item.id)} style={styles.deleteButton}>
                <Text style={styles.actionText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  button: {
    width: "80%",
    backgroundColor: "purple",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    borderRadius: 5,
    marginVertical: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 20,
  },
  TextInput: {
    borderColor: "black",
    borderWidth: 1,
    padding: 10,
    width: "80%",
    marginVertical: 10,
    fontSize: 16,
    color: "black",
    borderRadius: 5,
  },
  upperView: {
    marginTop: 50,
    backgroundColor: "lightgrey",
    width: "100%",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  postContainer: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 5,
    marginVertical: 10,
    width: 250,
    borderColor: "black",
    borderWidth: 1,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  postSubtitle: {
    fontSize: 16,
    color: "grey",
    marginBottom: 10,
  },
  postBody: {
    fontSize: 14,
    marginBottom: 10,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  editButton: {
    backgroundColor: "orange",
    padding: 10,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
  },
  actionText: {
    color: "white",
    fontWeight: "bold",
  },
});
