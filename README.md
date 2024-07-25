## Node Cli Chat App

### Workflow

 ```
    Welcome!
    /createaccount /login

    > /createaccount
    > username: ****
    > password: ****

    (success message)

  /chatrooms /createroom /onlineusers /logout /help /back

  ```

```
    > /createroom
    > roomname: ****
    > private: boolean
    > password?: ****
    > (chatroom created)
    <!-- join created chatroom using /chatrooms-->

```

```
    > /back
    <!-- to leave chat  -->
    <!--  close ws connection -->

```

```
    > /chatrooms /createroom /onlineusers /logout /help /back

    > List of chatroom/ onlineusers
    <!-- create ws connection -->
    /connect _roomname_/ _username_

    >/logout
    <!-- EXIT! app -->

```
