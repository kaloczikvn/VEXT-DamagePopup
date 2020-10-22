Events:Subscribe('Extension:Loaded', function()
    WebUI:Init()
end)

NetEvents:Subscribe('hit', function(damage, isHeadshot, transform)
    print(transform.trans);
    WebUI:ExecuteJS(string.format('addHit(%d, %s, %s, %s, %s)', math.floor(damage), tostring(isHeadshot),
                        transform.trans.x, transform.trans.y, transform.trans.z))
end)

Events:Subscribe('Player:UpdateInput', function()
  if InputManager:WentKeyDown(InputDeviceKeys.IDK_F9) then
    local player = PlayerManager:GetLocalPlayer()
    
    if player == nil or player.soldier == nil then
      return
    end

    print(player.soldier.transform.trans)
  end
end)

Events:Subscribe('Engine:Update', function(deltaTime)
    local player = PlayerManager:GetLocalPlayer()

    if player == nil or player.soldier == nil then
        return
    end

    local data = {
        x = player.soldier.transform.trans.x,
        y = player.soldier.transform.trans.y,
        z = player.soldier.transform.trans.z,
        yaw = player.input.authoritativeAimingYaw,
        pitch = player.input.authoritativeAimingPitch
    }

    WebUI:ExecuteJS('moveCamera(' .. json.encode(data) .. ');')
end)
